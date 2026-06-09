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

describe('visualExportRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('mock limiter always permits when Upstash is not configured', async () => {
    // Ensure env vars are absent
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const { visualExportRateLimit } = await import('../ratelimit');
    const result = await visualExportRateLimit.limit('user_123');

    expect(result.success).toBe(true);
    expect(result.limit).toBe(5);
    expect(result.remaining).toBe(4);
  });

  it('mock limiter returns correct shape for downstream consumers', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const { visualExportRateLimit } = await import('../ratelimit');
    const result = await visualExportRateLimit.limit('user_abc');

    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('limit');
    expect(result).toHaveProperty('remaining');
    expect(result).toHaveProperty('reset');
  });

  it('returns 5/h limit in mock (real blocking happens when Upstash returns success:false for >5/h)', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const { visualExportRateLimit } = await import('../ratelimit');
    const result = await visualExportRateLimit.limit('user_123');

    expect(result.limit).toBe(5);
    // Note: actual >5/h blocking is enforced by the slidingWindow(5, "1 h") config + Upstash;
    // downstream actions will see success:false and should surface rate limit error.
  });
});
