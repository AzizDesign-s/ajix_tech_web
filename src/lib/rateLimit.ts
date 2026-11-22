/**
 * Per-identifier sliding-window rate limiter.
 *
 * HONEST LIMITATION: this is in-process memory. On serverless each instance
 * keeps its own counters, so a determined attacker spreading requests across
 * instances gets more than `limit` through, and counters reset on cold start.
 * It stops casual abuse and accidental double-submits, which is what it is here
 * for — it is not a security boundary.
 *
 * To make it durable, swap the two functions below for @upstash/ratelimit
 * backed by Redis. No caller changes.
 */

type Hit = { count: number; resetAt: number };

const buckets = new Map<string, Hit>();

// Keeps the map from growing without bound on a long-lived instance.
const MAX_KEYS = 10_000;

function sweep(now: number) {
  if (buckets.size < MAX_KEYS) return;
  for (const [key, hit] of buckets) {
    if (hit.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(
  identifier: string,
  limit = 5,
  windowMs = 60 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(identifier);
  if (!existing || existing.resetAt <= now) {
    buckets.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { success: true, remaining: limit - existing.count, retryAfterSeconds: 0 };
}

/**
 * Short-lived record of recently-seen submission fingerprints, so a double
 * click or a retried request does not send the same enquiry twice.
 */
const recent = new Map<string, number>();

export function isDuplicate(fingerprint: string, windowMs = 5 * 60 * 1000): boolean {
  const now = Date.now();
  for (const [key, seenAt] of recent) {
    if (now - seenAt > windowMs) recent.delete(key);
  }
  if (recent.has(fingerprint)) return true;
  recent.set(fingerprint, now);
  return false;
}

/** Cheap non-cryptographic hash — only needs to detect exact repeats. */
export function fingerprint(parts: string[]): string {
  const input = parts.join('\u0000');
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}
