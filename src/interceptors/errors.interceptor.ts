import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      catchError((err) => {
        const errors = Array.isArray(err.response?.message)
          ? err.response.message
          : [err.message || 'An unexpected error occurred'];

        return of({
          errors,
          ...request.body,
        });
      }),
    );
  }
}
