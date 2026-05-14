import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadFileToR2 } from '../r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';

// Mock the AWS SDK
vi.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: class {
      send = vi.fn().mockResolvedValue({});
    },
    PutObjectCommand: vi.fn(),
  };
});

describe('Cloudflare R2 Storage (uploadFileToR2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLOUDFLARE_R2_BUCKET_NAME = 'test-bucket';
    process.env.CLOUDFLARE_R2_ENDPOINT = 'https://mock-endpoint.r2.cloudflarestorage.com';
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = 'mock-key';
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = 'mock-secret';
  });

  it('uploads a file buffer to R2 and returns the public URL', async () => {
    const mockBuffer = Buffer.from('test pdf content');
    const userId = 'user_123';
    const fileName = 'test-brand.pdf';
    const mimeType = 'application/pdf';
    
    const url = await uploadFileToR2(mockBuffer, fileName, mimeType, userId);
    
    // 1. Verify PutObjectCommand was called with correct parameters
    expect(PutObjectCommand).toHaveBeenCalledWith(expect.objectContaining({
      Bucket: 'test-bucket',
      ContentType: 'application/pdf',
      Key: expect.stringContaining(`brand-documents/user_123/`)
    }));
    
    // 3. Verify it returns the correct URL
    expect(url).toContain('test-bucket');
    expect(url).toContain('user_123');
    expect(url).toContain('test-brand.pdf');
  });

  it('throws an error if environment variables are missing', async () => {
    delete process.env.CLOUDFLARE_R2_BUCKET_NAME;
    
    const mockBuffer = Buffer.from('test');
    
    await expect(uploadFileToR2(mockBuffer, 'test.pdf', 'application/pdf', 'user_123'))
      .rejects
      .toThrow('Cloudflare R2 environment variables are missing');
  });
});
