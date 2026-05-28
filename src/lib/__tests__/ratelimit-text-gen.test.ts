import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Upstash to control rate limit responses
vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class {
    constructor() {}
    limit = vi.fn();
    static slidingWindow = vi.fn();
  },
}));

vi.mock('@upstash/redis', () => ({
  Redis: class {
    constructor() {}
  },
}));

describe('textGenRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('mock limiter always permits when Upstash is not configured', async () => {
    // Ensure env vars are absent
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const { textGenRateLimit } = await import('../ratelimit');
    const result = await textGenRateLimit.limit('user_123');

    expect(result.success).toBe(true);
    expect(result.limit).toBe(10);
    expect(result.remaining).toBe(9);
  });

  it('mock limiter returns correct shape for downstream consumers', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const { textGenRateLimit } = await import('../ratelimit');
    const result = await textGenRateLimit.limit('user_abc');

    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('limit');
    expect(result).toHaveProperty('remaining');
    expect(result).toHaveProperty('reset');
  });
});
