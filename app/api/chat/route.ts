import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import type { ChatCompletionCreateParamsStreaming, ChatCompletionMessageParam } from "openai/resources/chat/completions"
import { SYSTEM_PROMPT } from "./system-prompt"
import { checkRateLimit, getClientIp } from "./rate-limit"

// Node runtime (not edge) so the in-memory rate limiter keeps its state between requests.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
// NVIDIA retires models without notice: "thinkingmachines/inkling" (410 Gone, 2026-08-25) and the meta/llama-3.x
// instruct models are gone, and google/gemma-4-31b-it accepts the request but never answers (it hangs until timeout).
// nvidia/nemotron-3-super-120b-a12b streams in about a second; its reasoning arrives in reasoning_content, which is never forwarded.
// Override with NVIDIA_MODEL if this one is retired too. Ids listed at https://integrate.api.nvidia.com/v1/models are not all
// callable on every account, so test a candidate with a real chat request before switching.
const MODEL = process.env.NVIDIA_MODEL || "nvidia/nemotron-3-super-120b-a12b"

const MAX_TEXT_LENGTH = 2000
const MAX_HISTORY_MESSAGES = 20
const MAX_HISTORY_CONTENT_LENGTH = 4000
const MAX_BODY_BYTES = 100_000

// Low temperature / moderate top_p: the bot should stick to the facts in the system prompt, not improvise.
// max_tokens leaves room for a short answer plus any hidden reasoning if NVIDIA_MODEL is set to a reasoning model.
const TEMPERATURE = 0.3
const TOP_P = 0.9
const MAX_TOKENS = 1500

type ChatRole = "user" | "assistant"

interface ChatTurn {
  role: ChatRole
  content: string
}

interface ChatRequestBody {
  text?: unknown
  history?: unknown
}

const GENERIC_ERROR = "Sorry, I'm having trouble responding right now. Please try again in a moment."

function errorResponse(status: number, message: string, headers?: HeadersInit) {
  return NextResponse.json({ success: false, message }, { status, headers })
}

// Keeps only well-formed user/assistant turns. Anything else a browser sends (system, developer, tool, junk) is dropped.
function sanitizeHistory(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return []

  const turns: ChatTurn[] = []
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue
    const { role, content } = item as Record<string, unknown>
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue
    const trimmed = content.trim().slice(0, MAX_HISTORY_CONTENT_LENGTH)
    if (!trimmed) continue

    // A user message that never got an answer is followed by another user message; keep only the latest one.
    if (turns.length > 0 && turns[turns.length - 1].role === role) turns.pop()
    turns.push({ role, content: trimmed })
  }

  const recent = turns.slice(-MAX_HISTORY_MESSAGES)
  while (recent.length > 0 && recent[0].role !== "user") recent.shift()
  return recent
}

// Hides <think>...</think> blocks if the model emits its reasoning inline, even when the tags are split across chunks.
class ThinkStripper {
  private static readonly OPEN = "<think>"
  private static readonly CLOSE = "</think>"
  private buffer = ""
  private inThink = false

  push(chunk: string): string {
    this.buffer += chunk
    let out = ""
    for (;;) {
      if (this.inThink) {
        const end = this.buffer.indexOf(ThinkStripper.CLOSE)
        if (end === -1) {
          this.buffer = this.buffer.slice(-(ThinkStripper.CLOSE.length - 1))
          return out
        }
        this.buffer = this.buffer.slice(end + ThinkStripper.CLOSE.length)
        this.inThink = false
      } else {
        const start = this.buffer.indexOf(ThinkStripper.OPEN)
        if (start === -1) {
          const hold = ThinkStripper.partialTagLength(this.buffer, ThinkStripper.OPEN)
          out += this.buffer.slice(0, this.buffer.length - hold)
          this.buffer = this.buffer.slice(this.buffer.length - hold)
          return out
        }
        out += this.buffer.slice(0, start)
        this.buffer = this.buffer.slice(start + ThinkStripper.OPEN.length)
        this.inThink = true
      }
    }
  }

  flush(): string {
    const rest = this.inThink ? "" : this.buffer
    this.buffer = ""
    return rest
  }

  // Length of the longest suffix of `text` that is a proper prefix of `tag` (a tag that may continue in the next chunk).
  private static partialTagLength(text: string, tag: string): number {
    for (let len = Math.min(tag.length - 1, text.length); len > 0; len--) {
      if (text.endsWith(tag.slice(0, len))) return len
    }
    return 0
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.NVIDIA_APIKEY
  if (!apiKey) {
    console.error("[chat] NVIDIA_APIKEY is not set. Add it to .env.local (local) or the hosting environment variables (production).")
    return errorResponse(500, "The chat service is not configured.")
  }

  const limit = checkRateLimit(getClientIp(req.headers))
  if (!limit.ok) {
    return errorResponse(429, "You're sending messages too quickly. Please wait a moment and try again.", {
      "Retry-After": String(limit.retryAfterSeconds),
    })
  }

  let body: ChatRequestBody
  try {
    const raw = await req.text()
    if (raw.length > MAX_BODY_BYTES) return errorResponse(413, "Request is too large.")
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error("Body must be an object")
    body = parsed as ChatRequestBody
  } catch {
    return errorResponse(400, "Invalid request.")
  }

  if (typeof body.text !== "string" || !body.text.trim()) {
    return errorResponse(400, "Message cannot be empty.")
  }
  const text = body.text.trim()
  if (text.length > MAX_TEXT_LENGTH) {
    return errorResponse(400, `Message is too long (max ${MAX_TEXT_LENGTH} characters).`)
  }

  // The server alone builds the final prompt: trusted system message + sanitized history + current message.
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...sanitizeHistory(body.history),
    { role: "user", content: text },
  ]

  const params: ChatCompletionCreateParamsStreaming = {
    model: MODEL,
    messages,
    temperature: TEMPERATURE,
    top_p: TOP_P,
    max_tokens: MAX_TOKENS,
    stream: true,
  }

  try {
    const client = new OpenAI({ apiKey, baseURL: NVIDIA_BASE_URL, maxRetries: 1, timeout: 60_000 })
    // Resolves once NVIDIA accepts the request, so auth/quota/model errors surface here as a proper HTTP error.
    const completion = await client.chat.completions.create(params, { signal: req.signal })

    const encoder = new TextEncoder()
    const stripper = new ThinkStripper()

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        let sentContent = false
        const emit = (text: string) => {
          if (!text) return
          sentContent = true
          controller.enqueue(encoder.encode(text))
        }

        try {
          for await (const chunk of completion) {
            // Only the final answer (delta.content) is forwarded. Reasoning fields such as
            // reasoning_content / reasoning are deliberately never read, so they cannot reach the visitor.
            const content = chunk.choices?.[0]?.delta?.content
            if (content) emit(stripper.push(content))
          }
          emit(stripper.flush())

          if (!sentContent) throw new Error("NVIDIA stream finished without any answer content")
          controller.close()
        } catch (error) {
          // Erroring the stream makes the client's reader reject, which it reports as one clean error message.
          console.error("[chat] Stream error:", error)
          controller.error(error)
        }
      },
      cancel() {
        completion.controller.abort()
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(`[chat] NVIDIA API error (status ${error.status}):`, error.message)
      if (error.status === 410 || error.status === 404) {
        console.error(`[chat] Model "${MODEL}" is retired or unavailable. Set NVIDIA_MODEL to a live id from https://integrate.api.nvidia.com/v1/models`)
      }
      if (error.status === 429) return errorResponse(503, GENERIC_ERROR)
    } else {
      console.error("[chat] Request to NVIDIA failed:", error)
    }
    return errorResponse(502, GENERIC_ERROR)
  }
}
