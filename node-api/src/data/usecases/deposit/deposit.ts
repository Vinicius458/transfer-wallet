import { Deposit } from "@/domain/usecases";
import {
  AccountRepository,
  TransactionRepository,
  UserRepositoryInterface,
} from "@/data/protocols/db";
import { Transaction, TransactionType } from "@/domain/entities";

export class DepositUseCase implements Deposit {
  constructor(
    private userRepo: UserRepositoryInterface,
    private accountRepo: AccountRepository,
    private transactionRepo: TransactionRepository
  ) {}

  async execute(data: Deposit.Params): Promise<void> {
    const user = await this.userRepo.find(data.accountId);
    if (!user) throw new Error("User not found");

    const account = await this.accountRepo.findById(data.accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    account.credit(data.amount);

    const transaction = new Transaction(
      data.accountId,
      data.amount,
      TransactionType.DEPOSIT
    );

    const success = await this.accountRepo.updateAccount(account);
    if (!success) throw new Error("Erro ao atualizar a conta");

    await this.transactionRepo.saveTransaction(transaction);
  }
}
