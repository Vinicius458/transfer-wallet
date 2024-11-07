import { DataSource, Repository } from "typeorm";
import { User as UserModel } from "./user.entity";
import { UserRepositoryInterface } from "@/data/protocols/db/user/user-repository.interface";
import User from "@/domain/entities/user/user";

export class UserRepository implements UserRepositoryInterface {
  private userRepo: Repository<UserModel>;
  constructor(private dataSource: DataSource) {
    this.userRepo = this.dataSource.getRepository(UserModel);
  }

  async add(userEntity: User): Promise<string> {
    const user = this.userRepo.create({
      name: userEntity.name,
      email: userEntity.email,
      password: userEntity.password,
      account: userEntity.accountId,
    });

    const userCreated = await this.userRepo.save(user);
    return userCreated.id;
  }
  async find(userId: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["account"],
    });
    if (user) {
      const userEntity = new User(user.name, user.email, user.account);
      userEntity.id = user.id;
      userEntity.token = user.token;
      return userEntity;
    }
    return null;
  }
  async checkByEmail(email: string): Promise<Boolean> {
    const user = await this.userRepo.findOneBy({ email });
    return user != null;
  }

  async loadByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ["account"],
    });
    if (user) {
      const userEntity = new User(user.name, user.email, user.account);
      userEntity.id = user.id;
      return userEntity;
    }
    return null;
  }
  async updateAccessToken(id: string, token: string): Promise<void> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new Error("User not found");
    }
    user.token = token;
    await this.userRepo.save(user);
  }

  async loadByToken(token: string): Promise<string | null> {
    const user = await this.userRepo.findOneBy({ token });

    return user?.id || null;
  }
}
