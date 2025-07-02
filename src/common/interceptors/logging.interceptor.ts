import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, ip } = request;
    const userAgent = request.get("User-Agent") || "";

    const startTime = Date.now();

    this.logger.log(
      `Incoming Request: ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    if (body && Object.keys(body).length > 0) {
      this.logger.debug(`Request Body: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          const statusCode = response.statusCode;

          this.logger.log(
            `Outgoing Response: ${method} ${url} - ${statusCode} - ${duration}ms`,
          );

          if (statusCode >= 400) {
            this.logger.warn(
              `Error Response: ${method} ${url} - ${statusCode} - ${duration}ms`,
            );
          }
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;

          this.logger.error(
            `Request Error: ${method} ${url} - ${error.status || 500} - ${duration}ms - ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }
}
