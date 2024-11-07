import { Deposit } from "@/domain/usecases";
import {
  AccountRepository,
  TransactionRepository,
  UserRepositoryInterface,
} from "@/data/protocols/db";
import { TransactionType } from "@/domain/entities";
import { Account } from "@/domain/entities";
import { DepositUseCase } from "./deposit";
import User from "@/domain/entities/user/user";

export const mockUserParams = () => ({
  name: "Joao",
  email: "joao@email.com",
  password: "senha123",
});

const makeAccountRepository = function (): jest.Mocked<AccountRepository> {
  return {
    findById: jest.fn(),
    list: jest.fn(),
    updateAccount: jest.fn(),
    saveAccount: jest.fn(),
  };
};

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

const makeTransactionRepository =
  function (): jest.Mocked<TransactionRepository> {
    return {
      saveTransaction: jest.fn(),
      listTransaction: jest.fn(),
    };
  };

describe("DepositUseCase", () => {
  let depositUseCase: Deposit;
  let accountRepo: jest.Mocked<AccountRepository>;
  let userRepo: jest.Mocked<UserRepositoryInterface>;
  let transactionRepo: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    accountRepo = makeAccountRepository();
    transactionRepo = makeTransactionRepository();
    userRepo = makeUserRepository();
    depositUseCase = new DepositUseCase(userRepo, accountRepo, transactionRepo);
  });

  it("should successfully deposit into an account", async () => {
    // Arrange
    const account = new Account(1000);
    accountRepo.findById.mockResolvedValue(account);
    const addUserParams = mockUserParams();
    const user = new User(addUserParams.name, addUserParams.email, account.id);
    userRepo.find.mockResolvedValue(user);
    accountRepo.updateAccount.mockResolvedValue(true);

    const depositData = { accountId: account.id, amount: 200 };

    // Act
    await depositUseCase.execute(depositData);

    // Assert
    expect(accountRepo.findById).toHaveBeenCalledWith(account.id);
    expect(accountRepo.updateAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        balance: 1200,
      })
    );
    expect(transactionRepo.saveTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 200,
        type: TransactionType.DEPOSIT,
      })
    );
  });

  it("should throw an error if the user does not exist", async () => {
    // Arrange
    userRepo.find.mockResolvedValue(null);
    accountRepo.findById.mockResolvedValue(null);
    const depositData = { accountId: "1", amount: 200 };

    // Act & Assert
    await expect(depositUseCase.execute(depositData)).rejects.toThrow(
      "User not found"
    );

    expect(userRepo.find).toHaveBeenCalledWith(depositData.accountId);
    expect(accountRepo.updateAccount).not.toHaveBeenCalled();
    expect(transactionRepo.saveTransaction).not.toHaveBeenCalled();
  });
  it("should throw an error if the account does not exist", async () => {
    const account = new Account(1000);
    accountRepo.findById.mockResolvedValue(account);
    const addUserParams = mockUserParams();
    const user = new User(addUserParams.name, addUserParams.email, account.id);
    userRepo.find.mockResolvedValue(user);
    accountRepo.findById.mockResolvedValue(null);
    const depositData = { accountId: "1", amount: 200 };

    // Act & Assert
    await expect(depositUseCase.execute(depositData)).rejects.toThrow(
      "Account not found"
    );

    expect(accountRepo.findById).toHaveBeenCalledWith(depositData.accountId);
    expect(accountRepo.updateAccount).not.toHaveBeenCalled();
    expect(transactionRepo.saveTransaction).not.toHaveBeenCalled();
  });

  it("should throw an error if updating the account fails", async () => {
    // Arrange
    const account = new Account(1000);
    accountRepo.findById.mockResolvedValue(account);
    accountRepo.updateAccount.mockResolvedValue(false);
    const addUserParams = mockUserParams();
    const user = new User(addUserParams.name, addUserParams.email, account.id);
    userRepo.find.mockResolvedValue(user);
    const depositData = { accountId: account.id, amount: 200 };

    // Act & Assert
    await expect(depositUseCase.execute(depositData)).rejects.toThrow(
      "Erro ao atualizar a conta"
    );

    expect(accountRepo.findById).toHaveBeenCalledWith(depositData.accountId);
    expect(accountRepo.updateAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        balance: 1200,
      })
    );
    expect(transactionRepo.saveTransaction).not.toHaveBeenCalled();
  });

  it("should save the transaction after a successful deposit", async () => {
    const account = new Account(1000);
    accountRepo.findById.mockResolvedValue(account);
    accountRepo.updateAccount.mockResolvedValue(true);
    const addUserParams = mockUserParams();
    const user = new User(addUserParams.name, addUserParams.email, account.id);
    userRepo.find.mockResolvedValue(user);

    const depositData = { accountId: account.id, amount: 200 };

    await depositUseCase.execute(depositData);

    expect(transactionRepo.saveTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: account.id,
        amount: 200,
        type: TransactionType.DEPOSIT,
      })
    );
  });
});
