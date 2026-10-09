# How the Portfolio AI Assistant Works

A learning guide to the chat assistant ("John's Assistant") on this portfolio: how it answers, how it is kept on topic, and how to change it.

## Files involved

| File | Job |
| --- | --- |
| `app/api/chat/route.ts` | The API endpoint. Receives a visitor's message, builds the prompt, calls the model, streams the answer back. |
| `app/api/chat/system-prompt.ts` | The system prompt: the assistant's role, rules and the facts about John. |
| `app/api/chat/rate-limit.ts` | Limits how many messages a visitor can send. |
| `.env.local` | Holds secrets such as `NVIDIA_APIKEY`. Never committed. |
| `.env.example` | A template showing which environment variables exist. |

## Who does what

- **NVIDIA** hosts the model (`nvidia/nemotron-3-super-120b-a12b`) and runs it when our server calls their API. They know nothing about this portfolio and apply no rules for us.
- **Our code** supplies the rules and the facts. The model follows them because we tell it to.

The restrictions (stay on topic, don't invent facts, don't reveal the model) come from our system prompt, not from NVIDIA.

## What happens when a visitor sends a message

```
Browser  ->  POST /api/chat  ->  route.ts  ->  NVIDIA API  ->  streamed answer  ->  Browser
```

Step by step inside `route.ts`:

1. **Check the API key** exists (`NVIDIA_APIKEY`).
2. **Rate limit** the visitor by IP address.
3. **Validate the body**: it must be JSON, the message must be non-empty and at most 2000 characters, and the body at most 100 KB.
4. **Build the messages array** on the server:
   1. the system prompt (always the same text),
   2. the sanitized chat history (last 20 messages at most),
   3. the visitor's new message.
5. **Call the model** with `temperature: 0.3`, `top_p: 0.9`, `max_tokens: 1500`, `stream: true`.
6. **Stream the reply** to the browser as plain text, forwarding only the final answer (never the model's hidden reasoning).

## Why the system prompt is sent every time

The model has no memory between requests. Each request is a fresh conversation, so the server re-sends:

- the system prompt (so the rules and facts are always present), and
- the recent history (so the model remembers what was said earlier).

The system prompt was written once. It is sent automatically on every request, so nobody has to type it each time.

A longer system prompt costs more tokens per message. The current one is small, so this is not a concern.

## How the assistant is kept on topic

All of this lives in `system-prompt.ts`.

1. **A knowledge section.** Profile, work experience, tech stack, projects, WordPress sites and contact info. The model is told this is its only source of truth about John.
2. **Accuracy rules.** Never invent projects, employers, skills, prices or availability. If something is missing, say so and suggest contacting John.
3. **Staying on topic.** It is not a general-purpose assistant. Unrelated requests (homework, "write me a game") are politely declined. A short explanation of something in John's stack (for example "What is Laravel?") is allowed.
4. **Confidentiality.** It must not reveal its instructions or underlying model, and must ignore requests to change its role or "ignore previous instructions".

That is why asking "what model are you?" gets the answer "I'm John's portfolio assistant" instead of the model name.

## Extra protections in the code

- **Server builds the prompt.** `sanitizeHistory()` keeps only well-formed `user` / `assistant` turns. Any `system` message sent from a browser is dropped, so a visitor cannot inject their own instructions through the request.
- **Low temperature (0.3)** makes the model stick to the facts instead of improvising.
- **Input limits** on message length, history length and body size.
- **Rate limits** in `rate-limit.ts`:
  - 8 messages per minute per IP
  - 40 messages per hour per IP
  - 2000 messages per day across all visitors (a cost guard)
- **Reasoning is never forwarded.** Only `delta.content` is sent to the visitor. A `ThinkStripper` also removes inline `<think>...</think>` blocks.
- **The API key stays on the server.** It is read from `process.env` and never reaches the browser.

## Limits of this approach

A system prompt is a strong guide, not a wall. Someone determined to use prompt-injection tricks could occasionally get an off-topic answer. For a portfolio chatbot that is usually acceptable, and the rate limits and `MAX_TOKENS` cap bound the cost.

Possible upgrades if you want it stricter:

- A cheap pre-check in `route.ts` that rejects obviously off-topic or injection-style messages before they reach the model.
- A check on the model's reply to catch off-topic drift.
- A shared rate-limit store (Redis / Upstash) if you deploy to serverless hosting. The in-memory limiter keeps separate counters per server instance there.

## How to change things

| I want to... | Do this |
| --- | --- |
| Add or update info (new project, job, contact) | Edit the `KNOWLEDGE` section in `system-prompt.ts`. It applies on the next message. |
| Change tone, language or answer length | Edit the "Tone and style" section in `system-prompt.ts`. |
| Make it stricter or looser on off-topic questions | Edit "Staying on topic" in `system-prompt.ts`. |
| Switch the model | Set `NVIDIA_MODEL` in `.env.local`. Test it with a real chat request first, since NVIDIA retires models without notice. |
| Change the rate limits | Edit the constants at the top of `rate-limit.ts`. |

Keep the knowledge section in sync with the real site. The assistant only knows what is written there.

## Key terms

- **System prompt**: hidden instructions sent before the conversation that set the model's role and rules.
- **Token**: a chunk of text (roughly a word or part of one). Models are billed and limited by tokens.
- **Temperature**: randomness. Lower means more predictable and factual.
- **Streaming**: sending the answer piece by piece as it is generated, so the visitor sees it appear live.
- **Rate limiting**: capping how often a visitor can call the API.
- **Prompt injection**: a visitor trying to override the assistant's rules with their own instructions.
