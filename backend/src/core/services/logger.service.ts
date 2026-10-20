
import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';

export class AppLogger implements LoggerService {
  private logger: winston.Logger;

  constructor(label?: string) {
    this.initializeLogger(label);
  }

  initializeLogger(label?: string) {
    this.logger = winston.createLogger({
      level: 'info',
      defaultMeta: label ? { context: label } : undefined,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
      ],
    });
  }

  error(message: string, trace?: string) {
    this.logger.error(message, trace ? { trace } : {});
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  log(message: string) {
    this.logger.info(message);
  }
}
