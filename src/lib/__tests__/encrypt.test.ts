import { describe, it, expect, beforeEach } from 'vitest';
import { encrypt, decrypt } from '../encrypt';

// Use a deterministic 32-byte hex key for testing
const TEST_ENCRYPTION_KEY = 'a'.repeat(64); // 64 hex chars = 32 bytes

describe('AES-256 Encryption Helpers', () => {
  beforeEach(() => {
    process.env.ENCRYPTION_KEY = TEST_ENCRYPTION_KEY;
  });

  it('encrypts a string and returns a non-empty ciphertext', () => {
    const apiKey = 'sk-ant-test-key-1234';
    const ciphertext = encrypt(apiKey);
    expect(ciphertext).toBeDefined();
    expect(ciphertext).not.toBe(apiKey);
    expect(ciphertext.length).toBeGreaterThan(0);
  });

  it('produces different ciphertext each time (IV randomisation)', () => {
    const apiKey = 'sk-ant-test-key-1234';
    const first = encrypt(apiKey);
    const second = encrypt(apiKey);
    // Same plaintext → different ciphertext because IV is random each time
    expect(first).not.toBe(second);
  });

  it('decrypts ciphertext back to the original API key', () => {
    const apiKey = 'sk-ant-test-key-1234';
    const ciphertext = encrypt(apiKey);
    const decrypted = decrypt(ciphertext);
    expect(decrypted).toBe(apiKey);
  });

  it('throws if ENCRYPTION_KEY is missing', () => {
    delete process.env.ENCRYPTION_KEY;
    expect(() => encrypt('test')).toThrow('ENCRYPTION_KEY environment variable is not set');
  });
});
