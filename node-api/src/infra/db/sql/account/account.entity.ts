import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("accounts")
export class Account {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ type: "int" })
  version: number;
}
