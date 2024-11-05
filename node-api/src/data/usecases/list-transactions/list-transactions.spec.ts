import { TransactionRepository } from "@/data/protocols";
import { ListTransactionsUseCase } from "./list-transactions";
import { Transaction, TransactionType } from "@/domain/entities";

describe("ListAccountsUseCase", () => {
  let transactionRepository: jest.Mocked<TransactionRepository>;
  let listTransactionsUseCase: ListTransactionsUseCase;

  beforeEach(() => {
    transactionRepository = {
      saveTransaction: jest.fn(),
      listTransaction: jest.fn(),
    } as jest.Mocked<TransactionRepository>;
    listTransactionsUseCase = new ListTransactionsUseCase(
      transactionRepository
    );
  });

  it("should return a correctly formatted list of transactions", async () => {
    const accountData1 = {
      accountId: "1",
      balance: 100.0,
    };
    const accountData2 = {
      accountId: "2",
      balance: 200.0,
    };

    const transaction1 = new Transaction(
      "1",
      100.0,
      TransactionType.WITHDRAW,
      "2"
    );
    transaction1.id = "123";
    const transaction2 = new Transaction(
      "2",
      100.0,
      TransactionType.DEPOSIT,
      "1"
    );
    transaction2.id = "234";

    // Simula o retorno do repositório
    transactionRepository.listTransaction.mockResolvedValue([
      transaction1,
      transaction2,
    ]);

    const result = await listTransactionsUseCase.execute();

    expect(result).toEqual([
      {
        id: "123",
        accountId: transaction1.accountId,
        amount: transaction1.amount,
        type: transaction1.type,
        targetAccountId: transaction1.targetAccountId,
        createdAt: transaction1.createdAt,
      },
      {
        id: "234",
        accountId: transaction2.accountId,
        amount: transaction2.amount,
        type: transaction2.type,
        targetAccountId: transaction2.targetAccountId,
        createdAt: transaction2.createdAt,
      },
    ]);
    expect(transactionRepository.listTransaction).toHaveBeenCalledTimes(1);
  });

  it("should return an empty list if there are no transactions", async () => {
    // Simula o retorno do repositório vazio
    transactionRepository.listTransaction.mockResolvedValue([]);

    const result = await listTransactionsUseCase.execute();

    expect(result).toEqual([]);
    expect(transactionRepository.listTransaction).toHaveBeenCalledTimes(1);
  });
});
