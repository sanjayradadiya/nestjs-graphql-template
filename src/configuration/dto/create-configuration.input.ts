import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { MutationResponse } from 'src/payloads/mutationResponse';
import { Configuration } from '../entities/configuration.entity';

@InputType()
export class CreateConfigurationInput {
  @Field(() => GraphQLUpload, { nullable: true })
  logo: Promise<FileUpload>;

  @Field()
  businessName: string;

  @Field()
  footer: string;

  @Field()
  superAdminEmail: string;

  @Field(() => [String], { nullable: true })
  ccAdmins: string[];

  @Field()
  mailHost: string;

  @Field()
  mailUser: string;

  @Field({ nullable: true })
  mailPassword: string;
}

@ObjectType()
export class CreateConfigurationResponse extends MutationResponse {
  @Field(() => Configuration, { nullable: true })
  data: Configuration;
}
