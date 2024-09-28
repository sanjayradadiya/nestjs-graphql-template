import { UseGuards, UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LoggingInterceptor } from "src/interceptors/logging.interceptor";
import { GqlJwtAuthGuard } from "src/auth/gql-jwt-auth.guard";
import { PermissionsGuard } from "src/common/guards/permission.gaurd";
import { NotificationService } from "./notification.service";
import { CurrentUser } from "src/user/decorators/currentUser.decorator";
import { User } from "src/user/entities/user.entity";
import { NotificationList } from "src/user/payloads/notifications.payload";
import { CreateNotificationInput } from "./dto/create-notification-input";
import { Notification } from "./entities/notification.entity";

@Resolver(() => Notification)
@UseGuards(GqlJwtAuthGuard, PermissionsGuard)
@UseInterceptors(new LoggingInterceptor())
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  // @Mutation(() => CreateNotificationInput, { name: "createRole" })
  // createNotification(@Args("input") notification: CreateNotificationInput) {
  //   return this.notificationService.createNotification(notification);
  // }

  @Query(() => NotificationList, { name: "notifications" })
  notifications(@CurrentUser() user: User): Promise<NotificationList> {
    return this.notificationService.findNotifications(user.id);
  }
}
