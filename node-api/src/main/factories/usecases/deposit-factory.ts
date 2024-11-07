import { Deposit } from "@/domain/usecases";
import { DepositUseCase } from "@/data/usecases";
import { DBAccountRepository } from "@/infra/db/sql/account/account.repository";
import { DBTransactionRepository } from "@/infra/db/sql/transaction/transaction.repository";
import { AppDataSource } from "@/infra/db/sql/config";
import { UserRepository } from "@/infra/db/sql/user/user.repository";

export const makeDeposit = async (): Promise<Deposit> => {
  const accountRepository = new DBAccountRepository(AppDataSource);
  const transactionRepository = new DBTransactionRepository(AppDataSource);
  const userRepository = new UserRepository(AppDataSource);
  return new DepositUseCase(
    userRepository,
    accountRepository,
    transactionRepository
  );
};
