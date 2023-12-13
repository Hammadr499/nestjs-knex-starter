import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import logger from '../utils/logger';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor() {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    logger.error(exception);
    if (Array.isArray(exception?.response?.message)) {
      return response.status(status).json({
        message: Array.isArray(exception.response.message)
          ? exception.response.message[0]
          : exception.response.message || 'INTERVAL SERVER ERROR',
      });
    }
    const message =
      exception instanceof HttpException
        ? exception.message || 'INTERVAL SERVER ERROR'
        : 'INTERVAL SERVER ERROR';

    return response.status(status).json({
      message: message,
    });
  }
}
