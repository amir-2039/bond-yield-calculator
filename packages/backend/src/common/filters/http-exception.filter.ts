import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * RFC 7807 Problem Details for HTTP APIs.
 */
interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  errors?: Array<{ field: string; messages: string[] }>;
  instance?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const problem = this.toProblemDetails(exception, request);
    this.logger.error(
      `${request.method} ${request.url} - ${problem.status}: ${problem.detail ?? problem.title}`,
      exception instanceof Error ? exception.stack : undefined
    );

    response.status(problem.status).json(problem);
  }

  private toProblemDetails(exception: unknown, request: Request): ProblemDetails {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const isObject = typeof res === 'object' && res !== null;

      let errors: ProblemDetails['errors'];
      if (isObject && 'message' in res) {
        const msg = (res as { message?: unknown }).message;
        if (Array.isArray(msg)) {
          errors = msg.map((m: { property?: string; constraints?: Record<string, string> }) => ({
            field: m.property ?? 'unknown',
            messages: m.constraints ? Object.values(m.constraints) : [String(m)],
          }));
        }
      }

      return {
        type: `https://httpstatuses.com/${status}`,
        title: this.getTitle(status),
        status,
        detail:
          isObject && 'message' in res && typeof (res as { message: unknown }).message === 'string'
            ? (res as { message: string }).message
            : exception.message,
        errors,
        instance: request.url,
      };
    }

    return {
      type: 'https://httpstatuses.com/500',
      title: 'Internal Server Error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      detail: process.env['NODE_ENV'] === 'production' ? undefined : String(exception),
      instance: request.url,
    };
  }

  private getTitle(status: number): string {
    const titles: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
    };
    return titles[status] ?? 'Error';
  }
}
