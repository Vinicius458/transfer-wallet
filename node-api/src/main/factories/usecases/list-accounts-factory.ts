import { ListAccounts } from "@/domain/usecases";
import { ListAccountsUseCase } from "@/data/usecases";
import { DBAccountRepository } from "@/infra/db/sql/account/account.repository";
import { DataSource } from "typeorm";
import { initializeTestDataSource } from "@/infra/db/sql/config";

export const makeListAccounts = async (): Promise<ListAccounts> => {
  let dataSource: DataSource = await initializeTestDataSource();
  const accountRepository = new DBAccountRepository(dataSource);
  return new ListAccountsUseCase(accountRepository);
};
