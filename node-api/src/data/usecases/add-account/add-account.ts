import { AccountRepository } from "@/data/protocols";
import { Account } from "@/domain/entities";
import { AddAccount } from "@/domain/usecases/add-account";

export class AddAccountUseCase implements AddAccount {
  constructor(private accountRepo: AccountRepository) {}

  async execute(data: AddAccount.Params): Promise<AddAccount.Result> {
    const findAccount = await this.accountRepo.findById(data.accountId);
    if (findAccount) throw new Error("Conta Já existente");

    const account = new Account(data.balance);
    account.id = data.accountId;

    await this.accountRepo.saveAccount(account);
    return { accountId: account.id };
  }
}
