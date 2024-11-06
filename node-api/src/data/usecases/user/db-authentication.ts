import { Authentication } from "@/domain/usecases";
import {
  HashComparer,
  Encrypter,
  UserRepositoryInterface,
} from "@/data/protocols";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  async auth(
    authenticationParams: Authentication.Params
  ): Promise<Authentication.Result> {
    const user = await this.userRepository.loadByEmail(
      authenticationParams.email
    );
    if (user) {
      const isValid = await this.hashComparer.compare(
        authenticationParams.password,
        user.password
      );
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(user.id);
        await this.userRepository.updateAccessToken(user.id, accessToken);
        return {
          accessToken,
          name: user.name,
        };
      }
    }
    return null;
  }
}
