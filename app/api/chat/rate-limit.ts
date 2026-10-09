// Basic in-memory rate limiting for /api/chat.
//
// State lives in module memory, so it is per server process:
// - On a long-running Node server (VPS, Docker, `next start`) it works as expected.
// - On serverless hosting (e.g. Vercel) each warm instance keeps its own counters, so limits are
//   best-effort only. For hard guarantees use a shared store (Redis / Upstash) or the host's WAF.

interface Window {
  count: number
  resetAt: number
}

const PER_MINUTE = 8
const PER_HOUR = 40
const GLOBAL_PER_DAY = 2000 // overall cost guard across every visitor
const MAX_TRACKED_IPS = 5000

const minuteWindows = new Map<string, Window>()
const hourWindows = new Map<string, Window>()
let globalWindow: Window = { count: 0, resetAt: 0 }

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number }

function hit(map: Map<string, Window>, key: string, limit: number, durationMs: number, now: number): number {
  const current = map.get(key)
  if (!current || current.resetAt <= now) {
    map.set(key, { count: 1, resetAt: now + durationMs })
    return 0
  }
  if (current.count >= limit) return Math.ceil((current.resetAt - now) / 1000)
  current.count++
  return 0
}

function prune(map: Map<string, Window>, now: number) {
  if (map.size < MAX_TRACKED_IPS) return
  for (const [key, win] of map) {
    if (win.resetAt <= now) map.delete(key)
  }
  // Still full of live entries (e.g. a flood from many IPs): drop the oldest so memory stays bounded.
  while (map.size >= MAX_TRACKED_IPS) {
    const oldest = map.keys().next().value
    if (oldest === undefined) break
    map.delete(oldest)
  }
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now()

  if (globalWindow.resetAt <= now) globalWindow = { count: 0, resetAt: now + 24 * 60 * 60 * 1000 }
  if (globalWindow.count >= GLOBAL_PER_DAY) {
    return { ok: false, retryAfterSeconds: Math.ceil((globalWindow.resetAt - now) / 1000) }
  }

  prune(minuteWindows, now)
  prune(hourWindows, now)

  const minuteWait = hit(minuteWindows, ip, PER_MINUTE, 60 * 1000, now)
  if (minuteWait) return { ok: false, retryAfterSeconds: minuteWait }
  const hourWait = hit(hourWindows, ip, PER_HOUR, 60 * 60 * 1000, now)
  if (hourWait) return { ok: false, retryAfterSeconds: hourWait }

  globalWindow.count++
  return { ok: true }
}

// x-forwarded-for is set by the host's proxy. It can be spoofed if the app is exposed directly
// without a trusted proxy in front, in which case the limit degrades to the shared "unknown" bucket at worst.
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown"
}
