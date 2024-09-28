// import { Field } from "@nestjs/graphql";

import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { GraphQLObjectType } from 'graphql';

@ObjectType({ isAbstract: true })
abstract class GraphQLResponse<T> {
  @Field(() => GraphQLObjectType, { nullable: true })
  @Field(() => Type(() => Object))
  data: T;

  @Field()
  message: string;
}

export default GraphQLResponse;
