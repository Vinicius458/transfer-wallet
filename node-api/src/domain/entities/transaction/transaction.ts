import { v4 as uuid } from "uuid";
export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  TRANSFER = "TRANSFER",
}

export class Transaction {
  public id: string;
  public attempt: number;
  constructor(
    public readonly accountId: string,
    public readonly amount: number,
    public readonly type: TransactionType,
    public readonly targetAccountId?: string,
    public readonly createdAt: Date = new Date()
  ) {
    this.id = uuid();
  }
}
