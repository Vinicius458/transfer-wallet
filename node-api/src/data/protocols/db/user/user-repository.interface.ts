import User from "@/domain/entities/user/user";

export interface UserRepositoryInterface {
  add(userEntity: User): Promise<string>;

  find(userId: string): Promise<User | null>;
  checkByEmail(email: string): Promise<Boolean>;
  loadByEmail(email: string): Promise<User | null>;
  loadByToken(token: string): Promise<string | null>;
  updateAccessToken(id: string, token: string): Promise<void>;
}
