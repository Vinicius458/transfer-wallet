import { WithDraw } from "@/domain/usecases";
import { AccountRepository, TransactionRepository } from "@/data/protocols/db";
import { Account, TransactionType } from "@/domain/entities";
import { WithdrawUseCase } from "./with-draw";

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

  beforeEach(() => {
    accountRepo = makeAccountRepository();
    transactionRepo = makeTransactionRepository();
    sut = new WithdrawUseCase(accountRepo, transactionRepo);
  });

  it("Should throw error if withdrawal amount is zero or negative", async () => {
    const promise = sut.execute({ accountId: "123", amount: -100 });

    await expect(promise).rejects.toThrow("O valor de saque deve ser positivo");
  });

  it("Should throw error if account not found", async () => {
    accountRepo.findById.mockResolvedValueOnce(null);

    const promise = sut.execute({
      accountId: "123",
      amount: 100,
    });

    await expect(promise).rejects.toThrow("Conta não encontrada");
  });

  it("Should throw error if fails to update account (competition)", async () => {
    const fakeAccount = makeFakeAccount(200);
    accountRepo.findById.mockResolvedValueOnce(fakeAccount);
    accountRepo.updateAccount.mockResolvedValueOnce(false);

    const promise = sut.execute({ accountId: "123", amount: 100 });

    await expect(promise).rejects.toThrow(
      "Erro ao atualizar a conta, possivelmente devido a um conflito de versão"
    );
  });

  it("Should debit the account balance correctly on a successful withdrawal", async () => {
    const fakeAccount = makeFakeAccount(200);
    accountRepo.findById.mockResolvedValueOnce(fakeAccount);
    accountRepo.updateAccount.mockResolvedValueOnce(true);

    await sut.execute({ accountId: "123", amount: 100 });

    expect(fakeAccount.debit).toHaveBeenCalledWith(100);
    expect(fakeAccount.balance).toBe(100);
  });

  it("Should save the transaction after a successful withdrawal", async () => {
    const fakeAccount = makeFakeAccount(200);
    accountRepo.findById.mockResolvedValueOnce(fakeAccount);
    accountRepo.updateAccount.mockResolvedValueOnce(true);

    await sut.execute({ accountId: "123", amount: 100 });

    expect(transactionRepo.saveTransaction).toHaveBeenCalledTimes(1);
  });
});
