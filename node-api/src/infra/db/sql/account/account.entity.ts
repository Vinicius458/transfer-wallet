import { Entity, Column, PrimaryColumn, OneToOne } from "typeorm";
import { User } from "../user/user.entity";

@Entity("accounts")
export class Account {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: "int" })
  version: number;

  @OneToOne(() => User, (user) => user.account)
  user: User;
}
