import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. Tune the connection pool for production resilience
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: process.env.NODE_ENV === 'production' ? 20 : 5, // Avoid hogging connections in development
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Crash early if DB is down instead of hanging requests
});

const adapter = new PrismaPg(pool);

// 2. Prevent duplicate clients on hot-reloads (Nodemon / Next.js pattern)
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({ 
  adapter,
  // 3. Transparent logging to track performance and catch breaking queries
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'], 
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 4. Graceful Shutdown: Close connection pools if the Node process terminates
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
});

export default prisma;