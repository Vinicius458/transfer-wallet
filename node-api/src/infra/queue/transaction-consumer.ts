import { ProcessTransaction } from "@/data/usecases";
import { TransactionQueueRepository } from "@/data/protocols/queue/transaction-queue-repository";
import { Transaction, TransactionType } from "@/domain/entities";
import { makeDeposit, makeTransfer, makeWithdraw } from "@/main/factories";

export class TransactionConsumer {
  private readonly maxAttempts = 3; // Limite de tentativas para reprocessamento

  constructor(private transactionQueueRepo: TransactionQueueRepository) {}

  async startTransactionConsumer() {
    let processTransaction: ProcessTransaction;
    const [transfer, deposit, withdraw] = await Promise.all([
      makeTransfer(),
      makeDeposit(),
      makeWithdraw(),
    ]);

    this.transactionQueueRepo.consume(async (transaction: Transaction) => {
      switch (transaction.type) {
        case TransactionType.DEPOSIT:
          processTransaction = new ProcessTransaction(deposit);
          break;
        case TransactionType.WITHDRAW:
          processTransaction = new ProcessTransaction(withdraw);
          break;
        case TransactionType.TRANSFER:
          processTransaction = new ProcessTransaction(transfer);

          break;
      }
      await processTransaction.execute(transaction);
    });
  }
}
