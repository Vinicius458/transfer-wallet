import { Transfer } from "@/domain/usecases";
import { TransferUseCase } from "@/data/usecases";
import { DBAccountRepository } from "@/infra/db/sql/account/account.repository";
import { DBTransactionRepository } from "@/infra/db/sql/transaction/transaction.repository";
import { AppDataSource } from "@/infra/db/sql/config";
import { UserRepository } from "@/infra/db/sql/user/user.repository";

export const makeTransfer = async (): Promise<Transfer> => {
  const accountRepository = new DBAccountRepository(AppDataSource);
  const userRepository = new UserRepository(AppDataSource);
  const transactionRepository = new DBTransactionRepository(AppDataSource);
  return new TransferUseCase(
    userRepository,
    accountRepository,
    transactionRepository
  );
};
