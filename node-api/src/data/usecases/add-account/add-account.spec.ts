import { AddAccountUseCase } from "../add-account/add-account";
import { AccountRepository } from "@/data/protocols";
import { Account } from "@/domain/entities";

describe("AddAccountUseCase", () => {
  let accountRepo: jest.Mocked<AccountRepository>;
  let addAccountUseCase: AddAccountUseCase;

  beforeEach(() => {
    // Cria um mock do AccountRepository
    accountRepo = {
      findById: jest.fn(),
      saveAccount: jest.fn(),
      list: jest.fn(),
      updateAccount: jest.fn(),
    } as jest.Mocked<AccountRepository>;

    addAccountUseCase = new AddAccountUseCase(accountRepo);
  });

  it("Should create a new account successfully", async () => {
    const accountData = {
      accountId: "123",
      balance: 100.0,
    };

    const account = new Account(accountData.balance);
    account.id = "123";
    accountRepo.findById.mockResolvedValue(null);
    accountRepo.saveAccount.mockResolvedValue(account);

    const result = await addAccountUseCase.execute(accountData);

    expect(result).toEqual({ accountId: "123" });
    expect(accountRepo.findById).toHaveBeenCalledWith("123");
    expect(accountRepo.saveAccount).toHaveBeenCalledWith(expect.any(Account));
  });

  it("should throw an error if the account already exists", async () => {
    const accountData = {
      accountId: "123",
      balance: 100.0,
    };

    const account = new Account(accountData.balance);
    account.id = "123";
    accountRepo.findById.mockResolvedValue(account);

    await expect(addAccountUseCase.execute(accountData)).rejects.toThrow(
      "Conta Já existente"
    );
  });
});
