import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { startBot } from './bot';

const startServer = async () => {
  try {
    app.listen(env.PORT, () => {
      logger.info(`Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      logger.info(`Swagger docs available at http://localhost:${env.PORT}/api-docs`);
    });
    
    // Start Telegram Bot
    await startBot();
    
  } catch (error) {
    logger.error('Failed to start server or bot:', error);
    process.exit(1);
  }
};

startServer();
