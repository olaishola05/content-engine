import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Import standard pg for local development
import { Pool as PgPool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Define a global wrapper to prevent multiple instances in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // In production, we use the Neon adapter for serverless/edge compatibility
  // We do NOT set neonConfig.webSocketConstructor here as Vercel provides native support.
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("CRITICAL: DATABASE_URL is missing in production environment.");
    throw new Error("INTERNAL_DATABASE_CONNECTION_ERROR");
  }
  const pool = new Pool({ connectionString });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon(pool as any);
  prisma = new PrismaClient({ adapter });
} else {
  // Required for neon serverless only in local Node.js environments
  neonConfig.webSocketConstructor = ws;

  // In development, we check if we're hitting a local database or Neon
  const connectionString = process.env.DATABASE_URL || '';

  if (connectionString.includes('localhost') || connectionString.includes('127.0.0.1')) {
    // Local PostgreSQL instance - explicitly use standard pg adapter
    if (!globalForPrisma.prisma) {
      const pool = new PgPool({ connectionString });
      const adapter = new PrismaPg(pool);
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    prisma = globalForPrisma.prisma;
  } else {
    // Neon database used in development
    if (!globalForPrisma.prisma) {
      const pool = new Pool({ connectionString });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adapter = new PrismaNeon(pool as any);
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    prisma = globalForPrisma.prisma;
  }
}

export { prisma };
