import { AddUser } from "@/domain/usecases";
import { Hasher } from "@/data/protocols";
import { UserRepositoryInterface } from "@/data/protocols/db/user/user-repository.interface";
import UserEntity from "@/domain/entities/user/user";

export class AddUserUseCase implements AddUser {
  constructor(
    private readonly hasher: Hasher,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async add(userData: AddUser.Params): Promise<AddUser.Result> {
    const exists = await this.userRepository.checkByEmail(userData.email);
    let isValid = false;
    if (!exists) {
      const hashedPassword = await this.hasher.hash(userData.password);
      const user = new UserEntity(userData.name, userData.email);
      user.password = hashedPassword;
      isValid = !!(await this.userRepository.add(user));
    }
    return isValid;
  }
}
