import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import 'express-async-errors';
import config from '@config/index';
import logger from '@utils/logger';
import { globalErrorHandler } from '@middleware/errorHandler.middleware';

const app: Application = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg) } }));

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: config.app_name,
    version: config.app_version,
  });
});

// API Routes (to be added in subsequent modules)
app.use('/api', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use(globalErrorHandler);

// Start Server
const startServer = async (): Promise<void> => {
  try {
    app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
      logger.info(`📚 API Docs: http://localhost:${config.port}${config.swagger.path}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();

export default app;