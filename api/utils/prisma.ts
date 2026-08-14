import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Always cache the Prisma client on global so warm serverless invocations
// (Vercel, Node.js dev) reuse the same connection pool instead of opening
// a brand-new pool on every request. The previous guard
// `if (NODE_ENV !== 'production')` was inverted — it skipped caching in
// production, exhausting Supabase's connection limit under any load.
export const prisma = global.prisma ?? new PrismaClient();

if (!global.prisma) {
  global.prisma = prisma;
}
