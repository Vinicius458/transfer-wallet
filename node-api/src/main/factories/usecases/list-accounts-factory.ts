import { ListAccounts } from "@/domain/usecases";
import { ListAccountsUseCase } from "@/data/usecases";
import { DBAccountRepository } from "@/infra/db/sql/account/account.repository";
import { AppDataSource } from "@/infra/db/sql/config";

export const makeListAccounts = async (): Promise<ListAccounts> => {
  const accountRepository = new DBAccountRepository(AppDataSource);
  return new ListAccountsUseCase(accountRepository);
};
