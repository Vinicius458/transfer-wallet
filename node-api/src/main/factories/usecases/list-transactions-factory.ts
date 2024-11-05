import { ListTransactions } from "@/domain/usecases";
import { ListTransactionsUseCase } from "@/data/usecases";
import { DataSource } from "typeorm";
import { initializeTestDataSource } from "@/infra/db/sql/config";
import { DBTransactionRepository } from "@/infra/db/sql/transaction/transaction.repository";

export const makeListTransactions = async (): Promise<ListTransactions> => {
  let dataSource: DataSource = await initializeTestDataSource();
  const transactionRepository = new DBTransactionRepository(dataSource);
  return new ListTransactionsUseCase(transactionRepository);
};
