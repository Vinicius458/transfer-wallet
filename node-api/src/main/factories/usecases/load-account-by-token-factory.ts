import env from "@/main/config/env";
import { LoadAccountByToken } from "@/domain/usecases";
import { DbLoadUserByToken } from "@/data/usecases";
import { JwtAdapter } from "@/infra/cryptography";
import { AppDataSource } from "@/infra/db/sql/config/data-source";
import { UserRepository } from "@/infra/db/sql/user/user.repository";

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const userRepository = new UserRepository(AppDataSource);
  return new DbLoadUserByToken(jwtAdapter, userRepository);
};
