import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from 'src/auth/gql-jwt-auth.guard';
import { CurrentUser } from './decorators/currentUser.decorator';
import { CreateUserInput, CreateUserReturnType } from './dto/create-user.input';
import {
  ResetPasswordInput,
  ReturnType,
  UpdateUserInput,
  FirebaseInput,
  SuccessReturnType,
} from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserFilleter } from './dto/filter-user';
import { UserList } from './types/userList';
import {
  Permissions,
  PermissionsGuard,
} from 'src/common/guards/permission.gaurd';
import { AllowedPermissionActionsEnum } from 'src/permission/enums/allowedPermissionActions.enum';
import { EntityEnum } from 'src/module/enums/module.enum';
import { NotificationList } from './payloads/notifications.payload';
import { MarkReadPayload } from './payloads/markRead.payload';
import { MarkReadNotificationInput } from './dto/mark-read-notification.input';
import { RevertUserPayload } from './payloads/revertUser.payload';

@Resolver(() => User)
@UseGuards(GqlJwtAuthGuard, PermissionsGuard)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserList, { name: 'users' })
  @Permissions(AllowedPermissionActionsEnum.ACCESS, EntityEnum.EMPLOYEES)
  async users(
    @Args('filter', { nullable: true }) filter: UserFilleter,
  ): Promise<UserList> {
    return this.userService.findAll(filter);
  }

  @Query(() => User, { name: 'currentUser' })
  currentUser(@CurrentUser() user: User): Promise<User> {
    return this.userService.findCurrentUser(user?.id);
  }

  @Mutation(() => CreateUserReturnType, { name: 'createUser' })
  @Permissions(AllowedPermissionActionsEnum.CREATE, EntityEnum.EMPLOYEES)
  createUser(@Args('input') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => User, { name: 'updateUser' })
  @Permissions(AllowedPermissionActionsEnum.EDIT, EntityEnum.EMPLOYEES)
  updateUser(
    @Args('input') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ) {
    return this.userService.update(updateUserInput, user.id, false);
  }

  @Mutation(() => User, { name: 'updateProfile' })
  updateProfile(
    @Args('input') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ) {
    return this.userService.update(updateUserInput, user.id, true);
  }

  @Mutation(() => ReturnType, { name: 'removeUser' })
  @Permissions(AllowedPermissionActionsEnum.DELETE, EntityEnum.EMPLOYEES)
  removeUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }

  @Mutation(() => RevertUserPayload, { name: 'revertUser' })
  @Permissions(AllowedPermissionActionsEnum.EDIT, EntityEnum.EMPLOYEES)
  revertUser(@Args('id') id: string) {
    return this.userService.revert(id);
  }

  @Mutation(() => ReturnType, { name: 'resetPassword' })
  resetPassword(
    @Args('input')
    resetPasswordInput: ResetPasswordInput,
  ) {
    return this.userService.resetPassword(resetPasswordInput);
  }

  @Mutation(() => SuccessReturnType)
  storeFirebaseToken(
    @CurrentUser() user: User,
    @Args('token') token: FirebaseInput,
  ) {
    return this.userService.setFirebaseToken(user, token);
  }
  
  @Mutation(() => SuccessReturnType)
  logout(@CurrentUser() user: User) {
    return this.userService.loginStatus(user.id, false);
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Query(() => NotificationList, { name: 'currentUserNotifications' })
  async currentUserNotifications(
    @CurrentUser() user: User,
  ): Promise<NotificationList> {
    return this.userService.notificationList(user.id);
  }

  @Mutation(() => MarkReadPayload, { name: 'markReadNotification' })
  async markReadNotification(
    @Args('input') markReadInput: MarkReadNotificationInput,
    @CurrentUser() user: User,
  ): Promise<MarkReadPayload> {
    return this.userService.markReadNotification(markReadInput, user.id);
  }
}
