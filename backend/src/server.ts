import app from './app.js';
import { ENV } from './config/env.js';
import { logger } from './utils/logger.js';
import { prisma } from './config/db.js';

const PORT = ENV.PORT || 5000;

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect();
    logger.info('Connected successfully to PostgreSQL database');

    const server = app.listen(PORT, () => {
      logger.info(`Varsha Ayurveda Backend API running on port ${PORT} [${ENV.NODE_ENV}]`);
      logger.info(`Health check: http://localhost:${PORT}/api/health`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        logger.info('Database disconnected and server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();
