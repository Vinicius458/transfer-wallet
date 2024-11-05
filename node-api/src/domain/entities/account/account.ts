import { v4 as uuid } from "uuid";

export class Account {
  public id: string;
  constructor(
    public balance: number,
    private version: number = 1
  ) {
    this.id = uuid();
  }

  credit(amount: number): void {
    if (amount <= 0) throw new Error("O valor do depósito deve ser positivo");
    this.balance += amount;
  }

  debit(amount: number): void {
    if (amount <= 0) throw new Error("O valor do saque deve ser positivo");
    if (this.balance < amount) throw new Error("Saldo insuficiente");
    this.balance -= amount;
  }

  incrementVersion(): void {
    this.version += 1;
  }

  getVersion(): number {
    return this.version;
  }
}
