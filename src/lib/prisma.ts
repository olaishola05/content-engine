import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Required for neon serverless in local environments
neonConfig.webSocketConstructor = ws;

// Define a global wrapper to prevent multiple instances in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // In production, we use the Neon adapter for serverless/edge compatibility
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon(pool as any);
  prisma = new PrismaClient({ adapter });
} else {
  // In development, we check if we're hitting a local database or Neon
  const connectionString = process.env.DATABASE_URL || '';
  
  if (connectionString.includes('localhost') || connectionString.includes('127.0.0.1')) {
    // Local PostgreSQL instance - bypass the Neon adapter
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient();
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
