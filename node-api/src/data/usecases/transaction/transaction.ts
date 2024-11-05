import { TransactionStrategy } from "@/domain/usecases";
import { Transaction } from "@/domain/entities";

export class ProcessTransaction {
  constructor(private strategy: TransactionStrategy) {}

  async execute(transaction: Transaction): Promise<void> {
    await this.strategy.execute(transaction);
  }
}
