import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Permission } from '../../permission/entities/permission.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleStatusEnum } from '../enums/roleStatus.enum';

@ObjectType('roles')
@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  @IsNotEmpty({
    message: 'Role type is required',
  })
  @Field()
  role_type: string;

  @Column({
    type: 'enum',
    enum: RoleStatusEnum,
    default: RoleStatusEnum.ACTIVE,
  })
  @Field(() => RoleStatusEnum, {
    defaultValue: RoleStatusEnum.ACTIVE,
  })
  status: RoleStatusEnum;

  @ManyToMany(() => User, (user) => user.id)
  @Field(() => [User], { nullable: true })
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.id)
  @JoinTable()
  @Field(() => [Permission], { nullable: true })
  permission: Permission[];
}
