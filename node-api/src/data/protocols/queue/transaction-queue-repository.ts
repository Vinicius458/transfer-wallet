import { Transaction } from "@/domain/entities";

export interface TransactionQueueRepository {
  enqueue(transaction: Transaction): Promise<void>;
  consume(callback: (transaction: Transaction) => Promise<void>): Promise<void>;
}
