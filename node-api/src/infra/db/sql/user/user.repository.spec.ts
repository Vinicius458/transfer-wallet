import { User as UserEntity } from "./user.entity";
import { Account as AccountEntity } from "../account/account.entity";
import { UserRepository } from "./user.repository";
import User from "@/domain/entities/user/user";
import { AccountRepository, UserRepositoryInterface } from "@/data/protocols";
import { DataSource } from "typeorm";
import { initializeTestDataSource } from "../config";
import { Account } from "@/domain/entities";
import { DBAccountRepository } from "../account/account.repository";

describe("UserRepository", () => {
  let dataSource: DataSource;
  let userRepository: UserRepositoryInterface;
  let accountRepository: AccountRepository;

  beforeAll(async () => {
    dataSource = await initializeTestDataSource();
    userRepository = new UserRepository(dataSource);
    accountRepository = new DBAccountRepository(dataSource);
  });

  afterAll(async () => {
    (await initializeTestDataSource()).destroy();
  });

  beforeEach(async () => {
    await dataSource.getRepository(UserEntity).delete({});
    await dataSource.getRepository(AccountEntity).delete({});
  });

  it("should create a user successfully", async () => {
    const account = new Account(200.0);
    const accountResult = await accountRepository.saveAccount(account);
    const user = new User("Test User", "test@example.com", accountResult.id);
    user.password = "hashPassword";
    const userId = await userRepository.add(user);

    expect(userId).toBeDefined();

    const userCreated = await dataSource.getRepository(UserEntity).findOneBy({
      id: userId,
    });

    expect(userCreated?.name).toBe("Test User");
    expect(userCreated?.email).toBe("test@example.com");
  });

  it("should find a user by ID", async () => {
    const account = new Account(200.0);
    const accountResult = await accountRepository.saveAccount(account);
    const user = new User(
      "Another User",
      "another@example.com",
      accountResult.id
    );
    user.password = "hashPassword";
    const userId = await userRepository.add(user);

    const foundUser = await userRepository.find(userId);

    expect(foundUser).toBeDefined();
    expect(foundUser?.name).toBe("Another User");
    expect(foundUser?.email).toBe("another@example.com");
  });

  it("should return null if the user is not found", async () => {
    const foundUser = await userRepository.find("non-existent-id");

    expect(foundUser).toBeNull();
  });

  it("should return true if the user with the email exists", async () => {
    const account = new Account(200.0);
    const accountResult = await accountRepository.saveAccount(account);
    const user = new User(
      "Another User",
      "existing@example.com",
      accountResult.id
    );
    user.password = "hashPassword";
    await userRepository.add(user);
    const emailExists = await userRepository.checkByEmail(
      "existing@example.com"
    );

    expect(emailExists).toBe(true);
  });

  it("should return false if the user with the email not exists", async () => {
    const emailExists = await userRepository.checkByEmail(
      "nonexistent@example.com"
    );

    expect(emailExists).toBe(false);
  });

  it("should return user if the user by email exists", async () => {
    const account = new Account(200.0);
    const accountResult = await accountRepository.saveAccount(account);
    const user = new User("Another User", "existing@example.com", account.id);
    user.password = "hashPassword";
    await userRepository.add(user);
    const userResult = await userRepository.loadByEmail("existing@example.com");

    expect(userResult).toBeDefined();
    expect(userResult?.name).toBe("Another User");
    expect(userResult?.email).toBe("existing@example.com");
  });

  it("should return null if the user by email not exists", async () => {
    const user = await userRepository.loadByEmail("nonexistent@example.com");

    expect(user).toBe(null);
  });

  it("should update the access token of an existing user", async () => {
    const account = new Account(200.0);
    const accountResult = await accountRepository.saveAccount(account);
    const user = new User("John Doe", "john.doe@example.com", accountResult.id);
    user.password = "securepassword";
    await userRepository.add(user);

    const newToken = "newAccessToken";
    await userRepository.updateAccessToken(user.id, newToken);

    const updatedUser = await userRepository.find(user.id);
    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.token).toBe(newToken);
  });

  it("should throw an error if the user does not exist", async () => {
    await expect(
      userRepository.updateAccessToken("nonExistentId", "token")
    ).rejects.toThrow("User not found");
  });

  it("should return the user ID for a valid token", async () => {
    const account = new Account(200.0);
    const accountResult = await accountRepository.saveAccount(account);
    const user = new User("John Doe", "john.doe@example.com", accountResult.id);
    user.password = "securepassword";
    const userIdCreated = await userRepository.add(user);

    const newToken = "newAccessToken";
    await userRepository.updateAccessToken(user.id, newToken);

    const userId = await userRepository.loadByToken("newAccessToken");

    expect(userId).toBe(userIdCreated);
  });

  it("should return null for an invalid token", async () => {
    const userId = await userRepository.loadByToken("invalidToken");

    expect(userId).toBeNull();
  });
});
