import winston from 'winston';
import path from 'path';
import config from '@config/index';

const { combine, timestamp, printf, colorize, align } = winston.format;

const logDir = config.logging.dir;

const logger = winston.createLogger({
  level: config.logging.level,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        align(),
        printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
      ),
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],
});

export default logger;