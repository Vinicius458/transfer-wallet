import { AddAccount } from "@/domain/usecases";
import { AddAccountUseCase } from "@/data/usecases";
import { DBAccountRepository } from "@/infra/db/sql/account/account.repository";
import { DataSource } from "typeorm";
import { initializeTestDataSource } from "@/infra/db/sql/config";

export const makeAddAccount = async (): Promise<AddAccount> => {
  let dataSource: DataSource = await initializeTestDataSource();
  const accountRepository = new DBAccountRepository(dataSource);
  return new AddAccountUseCase(accountRepository);
};
