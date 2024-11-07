import { WithDraw } from "@/domain/usecases";
import {
  AccountRepository,
  TransactionRepository,
  UserRepositoryInterface,
} from "@/data/protocols/db";
import { Account } from "@/domain/entities";
import { WithdrawUseCase } from "./with-draw";
import User from "@/domain/entities/user/user";

export const mockUserParams = () => ({
  name: "Joao",
  email: "joao@email.com",
  password: "senha123",
});

const makeUserRepository = (): jest.Mocked<UserRepositoryInterface> => {
  return {
    find: jest.fn(),
    add: jest.fn().mockResolvedValue("hvtvbyvy"),
    checkByEmail: jest.fn().mockImplementation(() => Promise.resolve(false)),
    loadByEmail: jest.fn(),
    loadByToken: jest.fn(),
    updateAccessToken: jest.fn(),
  };
};

const makeAccountRepository = (): jest.Mocked<AccountRepository> => ({
  findById: jest.fn(),
  list: jest.fn(),
  updateAccount: jest.fn(),
  saveAccount: jest.fn(),
});

const makeTransactionRepository = (): jest.Mocked<TransactionRepository> => ({
  saveTransaction: jest.fn(),
  listTransaction: jest.fn(),
});

const makeFakeAccount = (balance: number) => {
  const account = new Account(balance);
  account.id = "1232";
  (account.debit = jest.fn().mockImplementation(function (
    this: Account,
    amount: number
  ) {
    this.balance -= amount;
  })),
    (account.credit = jest.fn()),
    (account.incrementVersion = jest.fn()),
    (account.getVersion = jest.fn().mockReturnValue(1));
  return account;
};

describe("WithdrawUseCase", () => {
  let sut: WithDraw;
  let accountRepo: jest.Mocked<AccountRepository>;
  let transactionRepo: jest.Mocked<TransactionRepository>;
  let userRepo: jest.Mocked<UserRepositoryInterface>;
  beforeEach(() => {
    accountRepo = makeAccountRepository();
    transactionRepo = makeTransactionRepository();
    userRepo = makeUserRepository();
    sut = new WithdrawUseCase(userRepo, accountRepo, transactionRepo);
  });

  it("Should throw error if withdrawal amount is zero or negative", async () => {
    const promise = sut.execute({ accountId: "123", amount: -100 });

    await expect(promise).rejects.toThrow(
      "The withdrawal amount must be positive"
    );
  });

  it("Should throw error if user not found", async () => {
    const promise = sut.execute({
      accountId: "123",
      amount: 100,
    });

    await expect(promise).rejects.toThrow("User not found");
  });
  it("Should throw error if account not found", async () => {
    const addUserParams = mockUserParams();
    const user = new User(addUserParams.name, addUserParams.email, "1232");
    userRepo.find.mockResolvedValue(user);
    accountRepo.findById.mockResolvedValueOnce(null);
    const promise = sut.execute({
      accountId: "123",
      amount: 100,
    });

    await expect(promise).rejects.toThrow("Account not found");
  });

  it("Should throw error if fails to update account (competition)", async () => {
    const fakeAccount = makeFakeAccount(200);
    const addUserParams = mockUserParams();
    const user = new User(addUserParams.name, addUserParams.email, "1232");
    userRepo.find.mockResolvedValue(user);
    accountRepo.findById.mockResolvedValueOnce(fakeAccount);
    accountRepo.updateAccount.mockResolvedValueOnce(false);

    const promise = sut.execute({ accountId: "123", amount: 100 });

    await expect(promise).rejects.toThrow(
      "Error updating account, possibly due to a version conflict"
    );
  });

  it("Should debit the account balance correctly on a successful withdrawal", async () => {
    const fakeAccount = makeFakeAccount(200);
    accountRepo.findById.mockResolvedValueOnce(fakeAccount);
    accountRepo.updateAccount.mockResolvedValueOnce(true);
    const addUserParams = mockUserParams();
    const user = new User(addUserParams.name, addUserParams.email, "1232");
    userRepo.find.mockResolvedValue(user);
    await sut.execute({ accountId: "123", amount: 100 });

    expect(fakeAccount.debit).toHaveBeenCalledWith(100);
    expect(fakeAccount.balance).toBe(100);
  });

  it("Should save the transaction after a successful withdrawal", async () => {
    const fakeAccount = makeFakeAccount(200);
    accountRepo.findById.mockResolvedValueOnce(fakeAccount);
    accountRepo.updateAccount.mockResolvedValueOnce(true);
    const addUserParams = mockUserParams();
    const user = new User(addUserParams.name, addUserParams.email, "1232");
    userRepo.find.mockResolvedValue(user);
    await sut.execute({ accountId: "123", amount: 100 });

    expect(transactionRepo.saveTransaction).toHaveBeenCalledTimes(1);
  });
});
