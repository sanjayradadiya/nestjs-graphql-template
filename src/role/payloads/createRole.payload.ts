import { Field, ObjectType } from '@nestjs/graphql';
import { MutationResponse } from '../../payloads/mutationResponse';
import { Role } from '../entities/role.entity';

@ObjectType()
export class CreateRolePayload extends MutationResponse {
  @Field(() => Role, { nullable: true })
  role?: Role;
}
