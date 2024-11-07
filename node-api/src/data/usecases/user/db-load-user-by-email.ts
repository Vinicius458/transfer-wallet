import { LoadUserByToken } from "@/domain/usecases";
import { UserRepositoryInterface } from "@/data/protocols";

export class DbLoadUserByEmail implements DbLoadUserByEmail {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async load(email: string): Promise<LoadUserByToken.Result> {
    const user = await this.userRepository.loadByEmail(email);
    if (user) {
      return { id: user.id };
    }
    return null;
  }
}
