import { Field, ObjectType } from '@nestjs/graphql';
import { validateOrReject } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { NotificationTypeEnum } from '../types/enum';

@ObjectType('notification')
@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ nullable: true, type: 'varchar', length: 1360 })
  @Field({ nullable: true })
  message: string;

  @Column({ type: 'boolean', default: true })
  @Field({ defaultValue: true })
  isUnread: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  @Field(() => User, { nullable: true })
  toUser: User;

  @ManyToOne(() => User)
  @Field(() => User, { nullable: true })
  fromUser: User;

  @Column({ nullable: true, type: 'varchar', length: 4000 })
  @Field({ nullable: true })
  metadata: string;

  @Column()
  @Field(() => NotificationTypeEnum)
  type: NotificationTypeEnum;

  @CreateDateColumn()
  @Field({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt: Date;

  @BeforeUpdate()
  @BeforeInsert()
  async validate(): Promise<void> {
    return validateOrReject(this);
  }
}
