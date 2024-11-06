import env from "@/main/config/env";
import { UserRepository } from "@/infra/db/sql/user/user.repository";
import { BcryptAdapter, JwtAdapter } from "@/infra/cryptography";
import { DbAuthentication } from "@/data/usecases";
import { Authentication } from "@/domain/usecases";
import { AppDataSource } from "@/infra/db/sql/config/data-source";

export const makeDbAuthentication = async (): Promise<Authentication> => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const userRepository = new UserRepository(AppDataSource);
  return new DbAuthentication(userRepository, bcryptAdapter, jwtAdapter);
};
