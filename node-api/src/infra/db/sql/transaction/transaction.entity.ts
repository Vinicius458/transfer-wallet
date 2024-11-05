import { Entity, Column, CreateDateColumn, PrimaryColumn } from "typeorm";

@Entity("transactions")
export class Transaction {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  accountId: string;

  @Column({ type: "varchar", nullable: true })
  targetAccountId?: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "varchar" })
  type: string;

  @CreateDateColumn()
  createdAt: Date;
}
