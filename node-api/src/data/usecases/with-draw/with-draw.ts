import { WithDraw } from "@/domain/usecases";
import {
  AccountRepository,
  TransactionRepository,
  UserRepositoryInterface,
} from "@/data/protocols/db";
import { Transaction, TransactionType } from "@/domain/entities";

export class WithdrawUseCase implements WithDraw {
  constructor(
    private userRepo: UserRepositoryInterface,
    private accountRepo: AccountRepository,
    private transactionRepo: TransactionRepository
  ) {}

  async execute(data: WithDraw.Params): Promise<void> {
    if (data.amount <= 0) {
      throw new Error("The withdrawal amount must be positive");
    }

    const user = await this.userRepo.find(data.accountId);
    if (!user) throw new Error("User not found");

    const account = await this.accountRepo.findById(data.accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    account.debit(data.amount);

    const transaction = new Transaction(
      data.accountId,
      data.amount,
      TransactionType.WITHDRAW
    );

    const success = await this.accountRepo.updateAccount(account);
    if (!success) {
      throw new Error(
        "Error updating account, possibly due to a version conflict"
      );
    }

    await this.transactionRepo.saveTransaction(transaction);
  }
}
