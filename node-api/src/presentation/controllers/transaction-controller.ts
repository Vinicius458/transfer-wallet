import { Controller, HttpResponse, Validation } from "@/presentation/protocols";
import { badRequest, serverError, ok } from "@/presentation/helpers";
import { Transaction, TransactionType } from "@/domain/entities";
import { TransactionQueueRepository } from "@/data/protocols/queue/transaction-queue-repository";

export class TransactionController implements Controller {
  constructor(
    private validation: Validation,
    private transactionQueueRepo: TransactionQueueRepository
  ) {}

  async handle(request: TransactionController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const transaction = new Transaction(
        request.accountId,
        request.amount,
        request.type as TransactionType,
        request.targetAccountId
      );

      await this.transactionQueueRepo.enqueue(transaction);

      return ok("Transação enfileirada com sucesso");
    } catch (error: any) {
      return serverError(error);
    }
  }
}

export namespace TransactionController {
  export type Request = {
    type: string;
    accountId: string;
    amount: number;
    targetAccountId?: string;
  };
}
