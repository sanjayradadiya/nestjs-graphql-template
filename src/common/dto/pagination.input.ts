import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field({ nullable: false })
  pageSize: number;

  @Field({ nullable: false })
  pageNumber: number;
}
