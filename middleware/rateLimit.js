import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Allow 100 requests per 60 seconds per identifier
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"),
  analytics: true,
});

export async function rateLimitMiddleware(req, res, next) {
  const userId = req.headers["x-user-id"] || "anon";
  const identifier = `${req.ip}:${userId}:${req.originalUrl}`;

  const { success, reset, limit, remaining } = await ratelimit.limit(identifier);

  res.setHeader("RateLimit-Limit", limit);
  res.setHeader("RateLimit-Remaining", remaining);
  res.setHeader("RateLimit-Reset", Math.floor(reset / 1000));

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    res.setHeader("Retry-After", retryAfter);
    return res.status(429).json({ error: "Too Many Requests" });
  }

  return next();
}
