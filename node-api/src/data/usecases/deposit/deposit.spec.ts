import { Deposit } from "@/domain/usecases";
import { AccountRepository, TransactionRepository } from "@/data/protocols/db";
import { TransactionType } from "@/domain/entities";
import { Account } from "@/domain/entities";
import { DepositUseCase } from "./deposit";

const makeAccountRepository = function (): jest.Mocked<AccountRepository> {
  return {
    findById: jest.fn(),
    list: jest.fn(),
    updateAccount: jest.fn(),
    saveAccount: jest.fn(),
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
  let transactionRepo: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    accountRepo = makeAccountRepository();
    transactionRepo = makeTransactionRepository();
    depositUseCase = new DepositUseCase(accountRepo, transactionRepo);
  });

  it("should successfully deposit into an account", async () => {
    // Arrange
    const account = new Account(1000);
    accountRepo.findById.mockResolvedValue(account);
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

  it("should throw an error if the account does not exist", async () => {
    // Arrange
    accountRepo.findById.mockResolvedValue(null);
    const depositData = { accountId: "1", amount: 200 };

    // Act & Assert
    await expect(depositUseCase.execute(depositData)).rejects.toThrow(
      "Conta não encontrada"
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
