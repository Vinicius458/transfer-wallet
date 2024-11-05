import { TransactionRepository } from "@/data/protocols";
import { ListTransactions } from "@/domain/usecases/list-transactions";

export class ListTransactionsUseCase implements ListTransactions {
  constructor(private transactionRepo: TransactionRepository) {}

  async execute(): Promise<ListTransactions.Result> {
    const findTransactions = await this.transactionRepo.listTransaction();
    return findTransactions.map((transaction) => {
      return {
        id: transaction.id,
        accountId: transaction.accountId,
        amount: transaction.amount,
        type: transaction.type,
        targetAccountId: transaction.targetAccountId,
        createdAt: transaction.createdAt,
      };
    });
  }
}
