import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field(() => Number, { defaultValue: 0 })
  pageNumber: number;

  @Field(() => Number, { defaultValue: 0 })
  totalCount?: number;
}
