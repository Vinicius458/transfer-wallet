import { AddAccount } from "@/domain/usecases";
import { AddAccountUseCase } from "@/data/usecases";
import { DBAccountRepository } from "@/infra/db/sql/account/account.repository";
import { AppDataSource } from "@/infra/db/sql/config";

export const makeAddAccount = async (): Promise<AddAccount> => {
  const accountRepository = new DBAccountRepository(AppDataSource);
  return new AddAccountUseCase(accountRepository);
};
