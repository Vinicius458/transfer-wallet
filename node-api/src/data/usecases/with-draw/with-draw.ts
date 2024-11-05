import { WithDraw } from "@/domain/usecases";
import { AccountRepository, TransactionRepository } from "@/data/protocols/db";
import { Transaction, TransactionType } from "@/domain/entities";

export class WithdrawUseCase implements WithDraw {
  constructor(
    private accountRepo: AccountRepository,
    private transactionRepo: TransactionRepository
  ) {}

  async execute(data: WithDraw.Params): Promise<void> {
    if (data.amount <= 0) {
      throw new Error("O valor de saque deve ser positivo");
    }

    const account = await this.accountRepo.findById(data.accountId);
    if (!account) {
      throw new Error("Conta não encontrada");
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
        "Erro ao atualizar a conta, possivelmente devido a um conflito de versão"
      );
    }

    await this.transactionRepo.saveTransaction(transaction);
  }
}
