import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MutationResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  reason?: string;
}
