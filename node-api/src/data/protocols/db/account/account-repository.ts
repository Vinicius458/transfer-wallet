import { Account } from "@/domain/entities";

export interface AccountRepository {
  findById(accountId: string): Promise<Account | null>;
  updateAccount(account: Account): Promise<boolean>;
  saveAccount(account: Account): Promise<Account>;
  list(): Promise<Array<Account>>;
}
