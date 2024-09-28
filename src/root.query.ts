import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class RootQuery {
  @Query(() => String)
  hello(): string {
    return 'Hello, GraphQL!';
  }
}
