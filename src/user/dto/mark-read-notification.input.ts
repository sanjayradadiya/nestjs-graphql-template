import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MarkReadNotificationInput {
  @Field({ nullable: true })
  markAll: boolean;

  @Field(() => [String], {
    nullable: true,
  })
  notificationIds: string[];
}
