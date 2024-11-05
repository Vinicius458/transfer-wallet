import { ListAccountsUseCase } from "./list-accounts";
import { AccountRepository } from "@/data/protocols";
import { Account } from "@/domain/entities";

describe("ListAccountsUseCase", () => {
  let accountRepository: jest.Mocked<AccountRepository>;
  let listAccountsUseCase: ListAccountsUseCase;

  beforeEach(() => {
    accountRepository = {
      findById: jest.fn(),
      list: jest.fn(),
      updateAccount: jest.fn(),
      saveAccount: jest.fn(),
    } as jest.Mocked<AccountRepository>;
    listAccountsUseCase = new ListAccountsUseCase(accountRepository);
  });

  it("should return a correctly formatted list of accounts", async () => {
    const accountData1 = {
      accountId: "1",
      balance: 100.0,
    };
    const accountData2 = {
      accountId: "2",
      balance: 200.0,
    };

    const account1 = new Account(accountData1.balance);
    account1.id = accountData1.accountId;

    const account2 = new Account(accountData2.balance);
    account2.id = accountData2.accountId;

    // Simula o retorno do repositório
    accountRepository.list.mockResolvedValue([account1, account2]);

    const result = await listAccountsUseCase.execute();

    expect(result).toEqual([
      { accountId: "1", ballance: 100.0 },
      { accountId: "2", ballance: 200.0 },
    ]);
    expect(accountRepository.list).toHaveBeenCalledTimes(1);
  });

  it("should return an empty list if there are no accounts", async () => {
    // Simula o retorno do repositório vazio
    accountRepository.list.mockResolvedValue([]);

    const result = await listAccountsUseCase.execute();

    expect(result).toEqual([]);
    expect(accountRepository.list).toHaveBeenCalledTimes(1);
  });
});
