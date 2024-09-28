import { Field, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from '../../payloads/mutationResponse';

@ObjectType()
export class RevertUserPayload extends MutationResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  message?: string;
}
