import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';

/**
 * This class is just a extension of AuthGuard('jwt') i.e. jwt strategy.
 * Usage pattern: @UseGuards(JwtAuthGuard())
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions<any> {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
