/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('resend', () => {
  return {
    Resend: class {
      emails = {
        send: vi.fn(),
      };
    },
  };
});

vi.mock('next/server', () => ({
  after: vi.fn((fn) => fn()),
}));

vi.mock('../prisma', () => ({
  prisma: {},
}));

describe('BetterAuth Settings and Hooks', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.FOUNDER_EMAIL;
    delete process.env.PRIVATE_BETA_MODE;
  });

  it('defines custom user fields for role and encryptedAnthropicApiKey', async () => {
    const { auth } = await import('../auth');
    const options = (auth as any).options;
    expect(options.user?.additionalFields).toBeDefined();
    expect(options.user.additionalFields.role).toBeDefined();
    expect(options.user.additionalFields.encryptedAnthropicApiKey).toBeDefined();
  }, 10000);

  it('assigns admin role if user email matches FOUNDER_EMAIL', async () => {
    process.env.FOUNDER_EMAIL = 'founder@example.com';
    const { auth } = await import('../auth');
    const options = (auth as any).options;
    const beforeHook = options.databaseHooks?.user?.create?.before;
    expect(beforeHook).toBeDefined();

    const mockUser = { email: 'founder@example.com', name: 'Founder' };
    const result = await beforeHook(mockUser);
    expect(result.data.role).toBe('admin');
  });

  it('assigns tester role to regular user during private beta mode', async () => {
    process.env.PRIVATE_BETA_MODE = 'true';
    const { auth } = await import('../auth');
    const options = (auth as any).options;
    const beforeHook = options.databaseHooks?.user?.create?.before;

    const mockUser = { email: 'tester@example.com', name: 'Tester' };
    const result = await beforeHook(mockUser);
    expect(result.data.role).toBe('tester');
  });

  it('assigns subscriber role to regular user when private beta mode is false', async () => {
    process.env.PRIVATE_BETA_MODE = 'false';
    const { auth } = await import('../auth');
    const options = (auth as any).options;
    const beforeHook = options.databaseHooks?.user?.create?.before;

    const mockUser = { email: 'user@example.com', name: 'User' };
    const result = await beforeHook(mockUser);
    expect(result.data.role).toBe('subscriber');
  });
});
