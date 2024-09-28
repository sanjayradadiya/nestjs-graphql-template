import { ObjectType, Field } from '@nestjs/graphql';
import { Permission } from '../../permission/entities/permission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityEnum } from '../enums/module.enum';

@ObjectType()
@Entity()
export class Module {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'enum', enum: EntityEnum, nullable: true })
  @Field(() => EntityEnum, {
    nullable: true,
  })
  module: EntityEnum;

  @OneToMany(() => Permission, (permission) => permission.id)
  @Field(() => [Permission], { nullable: true })
  permission: Permission[];
}
