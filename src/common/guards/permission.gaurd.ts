// permissions.guard.ts
import {
  Injectable,
  ExecutionContext,
  CanActivate,
  SetMetadata,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { flatMap, map } from 'lodash';
import { USER_ROLES } from '../enums';
import { AllowedPermissionActionsEnum } from 'src/permission/enums/allowedPermissionActions.enum';
import { EntityEnum } from 'src/module/enums/module.enum';
import { UserService } from 'src/user/user.service';
import { ForbiddenError } from '../errors';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const action = this.reflector.get('action', context.getHandler());
    const subject = this.reflector.get('subject', context.getHandler());

    if (action && subject) {
      const gqlContext = GqlExecutionContext.create(context);
      const user = gqlContext.getContext().req.user;

      if (!user) {
        return false; // User not authenticated
      }
      const roles = flatMap(user.roles, 'role_type');
      if (roles.includes(USER_ROLES.SUPER_ADMIN)) {
        return true;
      }
      const userData = await this.userService.findOneById(user.id);

      const permissionArray = userData.roles.map((r) => r.permission);
      const permissions = flatMap(permissionArray, (innerArray) => {
        return map(innerArray, (permission) => ({
          ...permission,
          subject: permission?.module?.module,
        }));
      });
      const hasPermission = permissions.some(
        (permission) =>
          permission?.action === action && permission.subject === subject,
      );

      if (hasPermission) {
        return true;
      } else {
        throw new ForbiddenError({
          message: `You are not authorize to ${action} ${subject}.`,
          where: `${__filename} - ${this.canActivate.name}`,
        });
      }
    }
    return true;
  }
}

// permissions.decorator.ts
export const Permissions =
  (action: AllowedPermissionActionsEnum, subject: EntityEnum) =>
  (target: any, key: string, descriptor: PropertyDescriptor) => {
    SetMetadata('action', action)(target, key, descriptor);
    SetMetadata('subject', subject)(target, key, descriptor);
  };
