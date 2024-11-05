import { AccountRepository, TransactionRepository } from "@/data/protocols/db";
import { Transaction, TransactionType } from "@/domain/entities";
import { Account } from "@/domain/entities";
import { TransferUseCase } from "./transfer";

describe("TransferUseCase", () => {
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

  const makeFakeAccount = (id: string, balance: number) => {
    const account = new Account(balance);
    account.id = id;
    (account.debit = jest.fn().mockImplementation(function (
      this: Account,
      amount: number
    ) {
      if (this.balance >= amount) {
        this.balance -= amount;
      } else {
        throw new Error("Saldo insuficiente");
      }
    })),
      (account.credit = jest.fn().mockImplementation(function (
        this: Account,
        amount: number
      ) {
        this.balance += amount;
      })),
      (account.incrementVersion = jest.fn()),
      (account.getVersion = jest.fn().mockReturnValue(1));
    return account;
  };

  const makeFakeTransaction = (
    id: string,
    accountId: string,
    amount: number,
    type: TransactionType,
    targetAccountId: string
  ) => {
    return new Transaction(accountId, amount, type, targetAccountId);
  };
  const makeSut = () => {
    const accountRepo = makeAccountRepository();
    const transactionRepo = makeTransactionRepository();
    const sut = new TransferUseCase(accountRepo, transactionRepo);
    return { sut, accountRepo, transactionRepo };
  };

  it("should correctly transfer the amount between accounts", async () => {
    const { sut, accountRepo, transactionRepo } = makeSut();
    const sourceAccount = makeFakeAccount("1", 1000);
    const targetAccount = makeFakeAccount("2", 500);

    accountRepo.findById.mockResolvedValueOnce(sourceAccount);
    accountRepo.findById.mockResolvedValueOnce(targetAccount);
    accountRepo.updateAccount.mockResolvedValue(true);
    transactionRepo.saveTransaction.mockResolvedValue(
      makeFakeTransaction("1", "1", 100, TransactionType.TRANSFER, "2")
    );

    await sut.execute({
      accountId: "1",
      targetAccountId: "2",
      amount: 100,
    });

    expect(sourceAccount.debit).toHaveBeenCalledWith(100);
    expect(targetAccount.credit).toHaveBeenCalledWith(100);
    expect(accountRepo.updateAccount).toHaveBeenCalledWith(sourceAccount);
    expect(accountRepo.updateAccount).toHaveBeenCalledWith(targetAccount);
    expect(transactionRepo.saveTransaction).toHaveBeenCalledTimes(1);
    expect(transactionRepo.saveTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: "1",
        amount: 100,
        type: TransactionType.TRANSFER,
        targetAccountId: "2",
      })
    );
  });

  it("should throw error if source account not found", async () => {
    const { sut, accountRepo } = makeSut();
    accountRepo.findById.mockResolvedValueOnce(null);

    await expect(
      sut.execute({
        accountId: "1",
        targetAccountId: "2",
        amount: 100,
      })
    ).rejects.toThrow("Conta de origem não encontrada");
  });

  it("should throw error if target account is not found", async () => {
    const { sut, accountRepo } = makeSut();
    const sourceAccount = makeFakeAccount("1", 1000);

    accountRepo.findById.mockResolvedValueOnce(sourceAccount);
    accountRepo.findById.mockResolvedValueOnce(null);

    await expect(
      sut.execute({
        accountId: "1",
        targetAccountId: "2",
        amount: 100,
      })
    ).rejects.toThrow("Conta de destino não encontrada");
  });

  it("It should throw an error if it fails to update one of the accounts", async () => {
    const { sut, accountRepo } = makeSut();
    const sourceAccount = makeFakeAccount("1", 1000);
    const targetAccount = makeFakeAccount("2", 500);

    accountRepo.findById.mockResolvedValueOnce(sourceAccount);
    accountRepo.findById.mockResolvedValueOnce(targetAccount);
    accountRepo.updateAccount.mockResolvedValueOnce(true);
    accountRepo.updateAccount.mockResolvedValueOnce(false);

    await expect(
      sut.execute({
        accountId: "1",
        targetAccountId: "2",
        amount: 100,
      })
    ).rejects.toThrow("Erro ao atualizar as contas");
  });

  it("Should perform simultaneous transfers while maintaining data consistency", async () => {
    const { sut, accountRepo } = makeSut();
    const sourceAccount = makeFakeAccount("1", 1000);
    const targetAccount = makeFakeAccount("2", 500);
    accountRepo.findById.mockImplementation(async (id) => {
      return id === "1" ? sourceAccount : targetAccount;
    });
    accountRepo.updateAccount.mockResolvedValue(true);

    const transferAmount = 100;
    const transferPromises = Array.from({ length: 5 }, () =>
      sut.execute({
        accountId: "1",
        targetAccountId: "2",
        amount: transferAmount,
      })
    );

    await Promise.all(transferPromises);

    expect(sourceAccount.debit).toHaveBeenCalledTimes(5);
    expect(targetAccount.credit).toHaveBeenCalledTimes(5);

    expect(sourceAccount.balance).toBe(1000 - transferAmount * 5);
    expect(targetAccount.balance).toBe(500 + transferAmount * 5);
  });

  it("should throw error on simultaneous transfers with insufficient balance", async () => {
    const { sut, accountRepo } = makeSut();
    const sourceAccount = makeFakeAccount("1", 200);
    const targetAccount = makeFakeAccount("2", 500);

    accountRepo.findById.mockImplementation(async (id) => {
      return id === "1" ? sourceAccount : targetAccount;
    });
    accountRepo.updateAccount.mockResolvedValue(true);

    const transferPromises = Array.from({ length: 3 }, () =>
      sut.execute({
        accountId: "1",
        targetAccountId: "2",
        amount: 100,
      })
    );

    await expect(Promise.all(transferPromises)).rejects.toThrow(
      "Saldo insuficiente"
    );
    expect(sourceAccount.debit).toHaveBeenCalledTimes(3);
    expect(targetAccount.credit).toHaveBeenCalledTimes(2);
  });

  it("Should ensure data integrity when detecting update conflict", async () => {
    const { sut, accountRepo } = makeSut();
    const sourceAccount = makeFakeAccount("1", 1000);
    const targetAccount = makeFakeAccount("2", 500);

    accountRepo.findById.mockImplementation(async (id) => {
      return id === "1" ? sourceAccount : targetAccount;
    });
    accountRepo.updateAccount.mockImplementation(async (account) => {
      if (account.getVersion() !== account.getVersion()) {
        throw new Error("Conflito de versão detectado");
      }
      account.incrementVersion();
      return true;
    });

    const transferPromises = Array.from({ length: 10 }, () =>
      sut.execute({
        accountId: "1",
        targetAccountId: "2",
        amount: 50,
      })
    );

    try {
      await Promise.all(transferPromises);
    } catch (error: any) {
      expect(error.message).toBe("Conflito de versão detectado");
    }

    expect(accountRepo.updateAccount).toHaveBeenCalled();
    expect(sourceAccount.balance).toBeLessThanOrEqual(1000);
    expect(targetAccount.balance).toBeGreaterThanOrEqual(500);
  });
});
