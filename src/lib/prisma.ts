import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Standard pg driver — supports TCP/TLS with channel_binding
import { Pool as PgPool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Define a global wrapper to prevent multiple instances in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // ✅ Use standard pg (TCP) in production — NOT WebSocket.
  // Vercel Serverless functions support TCP connections natively.
  // The @neondatabase/serverless WebSocket driver causes ErrorEvent failures
  // on Vercel and cannot handle channel_binding=require over WebSocket transport.
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("CRITICAL: DATABASE_URL is missing in production environment.");
    throw new Error("INTERNAL_DATABASE_CONNECTION_ERROR");
  }
  // max: 1 is important for serverless — each function invocation gets one connection
  const pool = new PgPool({ connectionString, max: 1 });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });

} else {
  // WebSocket polyfill required ONLY for local Node.js environments
  neonConfig.webSocketConstructor = ws;

  const connectionString = process.env.DATABASE_URL || '';

  if (connectionString.includes('localhost') || connectionString.includes('127.0.0.1')) {
    // Local PostgreSQL — use standard pg adapter
    if (!globalForPrisma.prisma) {
      const pool = new PgPool({ connectionString });
      const adapter = new PrismaPg(pool);
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    prisma = globalForPrisma.prisma;
  } else {
    // Remote Neon database in development — use WebSocket adapter
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
