import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, validateOrReject } from 'class-validator';
import { UserStatusEnum } from '../types/enum';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '../../role/entities/role.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { Notification } from '../../notification/entities/notification.entity';

@Entity('user')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  @Field({ nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  @Field({ nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail(
    {},
    {
      message: 'Not a valid Email Address',
    },
  )
  @Field()
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude({ toPlainOnly: true })
  @Field({ nullable: true })
  refreshToken: string;

  @Column({ type: 'bigint', nullable: true })
  @Field({ nullable: true })
  refreshTokenExpiry: number;

  @Column({ type: 'varchar', length: 13, nullable: true })
  @Field({ nullable: true })
  mobileNumber: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  @Field({ nullable: true })
  dob: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  @Field({ nullable: true })
  joiningDate: string;

  @ManyToMany(() => Role, (role) => role.id)
  @JoinTable()
  @Field(() => [Role])
  roles: Role[];

  @OneToMany(() => Notification, (notification) => notification.toUser)
  @Field(() => [Notification], { nullable: true })
  notifications: Notification[];

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.EMAIL_NOT_VERIFIED,
  })
  @Field(() => UserStatusEnum, {
    defaultValue: UserStatusEnum.EMAIL_NOT_VERIFIED,
  })
  status: UserStatusEnum;

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  firebaseToken: string;

  @Column({ type: 'boolean', nullable: true })
  @Field({ nullable: true })
  isLogin: boolean;

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  profilePicture: string;

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable: true })
  userTimeZone: string;

  @CreateDateColumn()
  @Field({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn()
  @Field({ nullable: true })
  deletedAt: Date;

  @Field(() => [Permission], { nullable: true })
  permissions: Permission[];

  @Field(() => [String], { nullable: true })
  modules: string[];

  @Field(() => Boolean, { defaultValue: false })
  isSuperAdmin: boolean;

  @BeforeUpdate()
  @BeforeInsert()
  async validate(): Promise<void> {
    return validateOrReject(this);
  }
}
