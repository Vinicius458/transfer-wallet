import { AddUser } from "@/domain/usecases";
import { AddUserUseCase } from "@/data/usecases";
import { DBAccountRepository } from "@/infra/db/sql/account/account.repository";
import { AppDataSource } from "@/infra/db/sql/config";
import { BcryptAdapter } from "@/infra/cryptography";
import { UserRepository } from "@/infra/db/sql/user/user.repository";

export const makeAddUser = async (): Promise<AddUser> => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const userRepository = new UserRepository(AppDataSource);
  const accountRepository = new DBAccountRepository(AppDataSource);
  return new AddUserUseCase(bcryptAdapter, userRepository, accountRepository);
};
