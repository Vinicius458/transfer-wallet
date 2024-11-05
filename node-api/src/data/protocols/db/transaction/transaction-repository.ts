import { Transaction } from "@/domain/entities";

export interface TransactionRepository {
  saveTransaction(transaction: Transaction): Promise<Transaction>;
  listTransaction(): Promise<Array<Transaction>>;
}
