/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ResponseFormat<T> {
  data: T;
  isArray: boolean;
  path: string;
  method: string;
  duration: string;
  statusCode: number;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseFormat<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    const start = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => ({
        data: data ?? null,
        isArray: Array.isArray(data),
        path: request.url,
        method: request.method,
        duration: `${Date.now() - start}ms`,
        statusCode: response.statusCode,
      })),
    );
  }
}
