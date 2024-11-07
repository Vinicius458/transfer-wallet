import { ListTransactions } from "@/domain/usecases";
import { ListTransactionsUseCase } from "@/data/usecases";
import { AppDataSource } from "@/infra/db/sql/config";
import { DBTransactionRepository } from "@/infra/db/sql/transaction/transaction.repository";

export const makeListTransactions = async (): Promise<ListTransactions> => {
  const transactionRepository = new DBTransactionRepository(AppDataSource);
  return new ListTransactionsUseCase(transactionRepository);
};
