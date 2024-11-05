import { AccountRepository } from "@/data/protocols";
import { ListAccounts } from "@/domain/usecases/list-accounts";

export class ListAccountsUseCase implements ListAccounts {
  constructor(private accountRepo: AccountRepository) {}

  async execute(): Promise<ListAccounts.Result> {
    const findAccount = await this.accountRepo.list();
    return findAccount.map((account) => {
      return { accountId: account.id, ballance: account.balance };
    });
  }
}
