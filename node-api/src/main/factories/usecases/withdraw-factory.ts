import { WithDraw } from "@/domain/usecases";
import { WithdrawUseCase } from "@/data/usecases";
import { DBAccountRepository } from "@/infra/db/sql/account/account.repository";
import { DBTransactionRepository } from "@/infra/db/sql/transaction/transaction.repository";
import { AppDataSource } from "@/infra/db/sql/config";
import { UserRepository } from "@/infra/db/sql/user/user.repository";

export const makeWithdraw = async (): Promise<WithDraw> => {
  const accountRepository = new DBAccountRepository(AppDataSource);
  const transactionRepository = new DBTransactionRepository(AppDataSource);
  const userRepository = new UserRepository(AppDataSource);

  return new WithdrawUseCase(
    userRepository,
    accountRepository,
    transactionRepository
  );
};
