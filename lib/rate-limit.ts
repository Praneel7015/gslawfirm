import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate-limit /api/lead at 5 submissions / hour / IP.
 *
 * Primary: Upstash Redis (production-correct, distributed).
 * Fallback: in-memory Map (per-instance only; survives a single
 *           server lambda's warm window). Used only if Upstash env
 *           vars are missing, logs a warning at module load.
 *
 * See build-prompt §8 for the policy.
 */

const WINDOW = "1 h" as const;
const LIMIT = 5;

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let limiter:
  | { check: (key: string) => Promise<{ ok: boolean; remaining: number; resetAt: number }> }
  | null = null;

if (upstashUrl && upstashToken) {
  const redis = new Redis({ url: upstashUrl, token: upstashToken });
  const rl = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(LIMIT, WINDOW),
    prefix: "gslawfirm:lead",
    analytics: false,
  });
  limiter = {
    async check(key) {
      const r = await rl.limit(key);
      return { ok: r.success, remaining: r.remaining, resetAt: r.reset };
    },
  };
} else {
  console.warn(
    "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN missing, falling back to in-memory limiter. " +
      "OK for dev; in production add Upstash creds (see docs/BACKEND_SETUP.md).",
  );
  // Per-process in-memory limiter. Map<key, timestamps[]>.
  const hits = new Map<string, number[]>();
  const WINDOW_MS = 60 * 60 * 1000;
  limiter = {
    async check(key) {
      const now = Date.now();
      const cutoff = now - WINDOW_MS;
      const arr = (hits.get(key) ?? []).filter((t) => t > cutoff);
      if (arr.length >= LIMIT) {
        const resetAt = arr[0]! + WINDOW_MS;
        return { ok: false, remaining: 0, resetAt };
      }
      arr.push(now);
      hits.set(key, arr);
      return { ok: true, remaining: LIMIT - arr.length, resetAt: now + WINDOW_MS };
    },
  };
}

export const rateLimit = limiter;
