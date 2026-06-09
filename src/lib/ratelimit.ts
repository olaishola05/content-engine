import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Upstash is configured to avoid crashing local development
const isUpstashConfigured = 
  !!process.env.UPSTASH_REDIS_REST_URL && 
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Create a new ratelimiter, that allows 5 requests per 10 seconds
export const authRateLimit = isUpstashConfigured
  ? new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(5, "10 s"),
      analytics: true,
      prefix: "@upstash/ratelimit/auth",
    })
  : {
      // Mock limiter for local development when Upstash is not set up
      limit: async () => ({ success: true, limit: 5, remaining: 4, reset: Date.now() }),
    };

// Text generation: 10 generations per hour per user
export const textGenRateLimit = isUpstashConfigured
  ? new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      analytics: true,
      prefix: "@upstash/ratelimit/text-gen",
    })
  : {
      // Mock limiter for local development when Upstash is not set up
      limit: async () => ({ success: true, limit: 10, remaining: 9, reset: Date.now() }),
    };

// Visual exports (carousels + impact cards): max 5 exports per hour per user
export const visualExportRateLimit = isUpstashConfigured
  ? new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "@upstash/ratelimit/visual-export",
    })
  : {
      // Mock limiter for local development when Upstash is not set up
      limit: async () => ({ success: true, limit: 5, remaining: 4, reset: Date.now() }),
    };
