import {
  AccountRepository,
  TransactionRepository,
  UserRepositoryInterface,
} from "@/data/protocols/db";
import { Transaction, TransactionType } from "@/domain/entities";
import { Transfer } from "@/domain/usecases";

export class TransferUseCase implements Transfer {
  constructor(
    private userRepo: UserRepositoryInterface,
    private accountRepo: AccountRepository,
    private transactionRepo: TransactionRepository
  ) {}

  async execute(data: Transfer.Params): Promise<void> {
    const sourceUser = await this.userRepo.find(data.accountId);
    if (!sourceUser) throw new Error("Source user not found");

    const sourceAccount = await this.accountRepo.findById(data.accountId);
    if (!sourceAccount) throw new Error("Source account not found");

    const targetUser = await this.userRepo.find(data.targetAccountId);
    if (!targetUser) throw new Error("Target user not found");

    const targetAccount = await this.accountRepo.findById(data.targetAccountId);
    if (!targetAccount) throw new Error("Target account not found");

    sourceAccount.debit(data.amount);

    targetAccount.credit(data.amount);

    const transaction = new Transaction(
      data.accountId,
      data.amount,
      TransactionType.TRANSFER,
      data.targetAccountId
    );

    const successSource = await this.accountRepo.updateAccount(sourceAccount);
    const successTarget = await this.accountRepo.updateAccount(targetAccount);

    if (!successSource || !successTarget)
      throw new Error("Error updating accounts");

    await this.transactionRepo.saveTransaction(transaction);
  }
}
