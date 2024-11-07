import { LoadUserByEmail } from "@/domain/usecases";
import { DbLoadUserByEmail } from "@/data/usecases";
import { AppDataSource } from "@/infra/db/sql/config/data-source";
import { UserRepository } from "@/infra/db/sql/user/user.repository";

export const makeDbLoadUserByEmail = (): LoadUserByEmail => {
  const userRepository = new UserRepository(AppDataSource);
  return new DbLoadUserByEmail(userRepository);
};
