import { AccountRepository, TransactionRepository } from "@/data/protocols/db";
import { Transaction, TransactionType } from "@/domain/entities";
import { Transfer } from "@/domain/usecases";

export class TransferUseCase implements Transfer {
  constructor(
    private accountRepo: AccountRepository,
    private transactionRepo: TransactionRepository
  ) {}

  async execute(data: Transfer.Params): Promise<void> {
    const sourceAccount = await this.accountRepo.findById(data.accountId);
    if (!sourceAccount) throw new Error("Conta de origem não encontrada");

    const targetAccount = await this.accountRepo.findById(data.targetAccountId);
    if (!targetAccount) throw new Error("Conta de destino não encontrada");

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
      throw new Error("Erro ao atualizar as contas");

    await this.transactionRepo.saveTransaction(transaction);
  }
}
