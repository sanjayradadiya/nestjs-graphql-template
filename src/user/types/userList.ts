import { Field, ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../entities/user.entity';

@ObjectType('userList')
export class UserList {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => [User], { nullable: true })
  data: User[];

  @Field({ defaultValue: 0 })
  pageNumber: number;

  @Field({ defaultValue: 0 })
  totalCount: number;
}
