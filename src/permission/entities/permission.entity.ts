import { ObjectType, Field } from '@nestjs/graphql';
import { Module } from '../../module/entities/module.entity';
import { Role } from '../../role/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AllowedPermissionActionsEnum } from '../enums/allowedPermissionActions.enum';
import { EntityEnum } from '../../module/enums/module.enum';

@ObjectType('permission')
@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 150 })
  @Field(() => String, { description: 'Permission key' })
  key: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  @Field(() => String, { description: 'Permission Label' })
  label: string;

  @ManyToOne(() => Module, (module) => module.id)
  @Field(() => Module, { nullable: true })
  @JoinColumn()
  module: Module;

  @Column({ type: 'enum', enum: AllowedPermissionActionsEnum, nullable: true })
  @Field(() => AllowedPermissionActionsEnum, {
    nullable: true,
  })
  action: AllowedPermissionActionsEnum;

  @Field(() => EntityEnum, {
    nullable: true,
  })
  subject: EntityEnum;

  @ManyToMany(() => Role, (role) => role.id)
  @Field(() => [Role], { nullable: true })
  role: Role[];
}
