import { Field, InputType } from '@nestjs/graphql';
import { UserStatusEnum } from '../../types/user/user';

@InputType()
export class UserFilleter {
  @Field({ nullable: true })
  status: UserStatusEnum;

  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: false })
  pageNumber: number;

  @Field({ nullable: false })
  pageSize: number;

  @Field({ nullable: true })
  searchString: string;
}
