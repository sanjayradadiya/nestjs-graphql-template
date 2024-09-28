import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before reaching the handler', context.getType());
    if ((context.getType() as string) === 'graphql') {
      const gqlExecutionContext = GqlExecutionContext.create(context);
      const res = gqlExecutionContext.getContext().req;
    }
    if ((context.getType() as string) === 'http') {
      const req = context.switchToHttp().getRequest();
    }
    // const token = request.headers['authorization'];
    // console.log(token)
    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`Response Lag...${Date.now() - now}ms`)));
  }
}
