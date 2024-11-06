import { LoadUserByToken } from "@/domain/usecases";
import { Decrypter, UserRepositoryInterface } from "@/data/protocols";

export class DbLoadUserByToken implements LoadUserByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async load(accessToken: string): Promise<LoadUserByToken.Result> {
    let token: string;
    try {
      token = await this.decrypter.decrypt(accessToken);
    } catch (error) {
      return null;
    }
    if (token) {
      const user = await this.userRepository.loadByToken(accessToken);
      if (user) {
        return { id: user };
      }
    }
    return null;
  }
}
