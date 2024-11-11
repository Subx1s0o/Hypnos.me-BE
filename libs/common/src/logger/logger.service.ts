import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger('GlobalLogger');

  log(statusCode: number, method: string, endpoint: string, message: string) {
    this.logger.log(this.formatMessage(method, message, statusCode, endpoint));
  }

  warn(statusCode: number, method: string, endpoint: string, message: string) {
    this.logger.warn(this.formatMessage(method, message, statusCode, endpoint));
  }

  error(statusCode: number, method: string, endpoint: string, message: string) {
    this.logger.error(
      this.formatMessage(method, message, statusCode, endpoint),
    );
  }

  private formatMessage(
    method: string,
    message: string,
    statusCode: number,
    endpoint: string,
  ): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${method.toUpperCase()}] ${statusCode} ${endpoint} - ${message}`;
  }
}
