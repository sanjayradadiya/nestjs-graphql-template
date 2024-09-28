import { Field, ObjectType } from "@nestjs/graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Configuration {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => String)
  id: string;

  @Column({ type: "varchar", nullable: true })
  @Field(() => String, { nullable: true })
  businessName: string;

  @Column({ type: "varchar", nullable: true })
  @Field(() => String)
  logo: string;

  @Column({ type: "varchar", nullable: true })
  @Field({ nullable: true })
  footer: string;

  @Column({ type: "varchar", nullable: true })
  @Field({ nullable: true })
  superAdminEmail: string;

  @Column({
    type: "varchar",
    nullable: true,
    transformer: {
      to: (value: string[]) => JSON.stringify(value),
      from: (value: string) => JSON.parse(value),
    },
  })
  @Field(() => [String], { nullable: true })
  ccAdmins: string[];

  @Column({ type: "varchar", nullable: true })
  @Field({ nullable: true })
  mailHost: string;

  @Column({ type: "varchar", nullable: true })
  @Field({ nullable: true })
  mailUser: string;

  @Column({
    type: "varchar",
    nullable: true,
  })
  @Field({ nullable: true })
  mailPassword: string;

  @CreateDateColumn()
  @Field({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn()
  @Field({ nullable: true })
  deletedAt: Date;
}
