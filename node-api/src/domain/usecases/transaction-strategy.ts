import { Transaction } from "@/domain/entities";

export interface TransactionStrategy {
  execute(transaction: Partial<Transaction>): Promise<void>;
}
