import { Controller, HttpResponse } from "@/presentation/protocols";
import { serverError, ok } from "@/presentation/helpers";
import { ListTransactions } from "@/domain/usecases";

export class ListTransactionsController implements Controller {
  constructor(private listTransactionsUseCase: ListTransactions) {}

  async handle(): Promise<HttpResponse> {
    try {
      const listTransactions = await this.listTransactionsUseCase.execute();

      return ok(listTransactions);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
