import { Field, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from '../../payloads/mutationResponse';

@ObjectType()
export class MarkReadPayload extends MutationResponse {
  @Field({ defaultValue: 0 })
  unreadCount: number;
}
