import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { NotificationTypeEnum } from '../types/enum';

@InputType()
export class CreateNotificationInput {
  @IsNotEmpty()
  @Field()
  message: string;

  @Field({ defaultValue: true })
  isUnread: boolean;

  @Field(() => User, { nullable: true })
  toUser: User;

  @Field(() => User, { nullable: true })
  fromUser: User;

  @Field({ nullable: true })
  metaData: string;

  @Field(() => NotificationTypeEnum)
  type: NotificationTypeEnum;
}

@ObjectType()
export class ReturnCreateNotification {
  @Field({ nullable: false })
  message: string;

  @Field({ nullable: false })
  valid: false;
}
