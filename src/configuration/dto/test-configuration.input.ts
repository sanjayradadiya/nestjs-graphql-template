import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class TestMailConfigurationInput {
  @Field(() => String)
  host: string;
  @Field(() => String)
  user: string;
  @Field(() => String)
  pass: string;
  @Field(() => String)
  testEmailAddress: string;
}
