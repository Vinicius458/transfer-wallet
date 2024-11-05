import { Controller, HttpResponse } from "@/presentation/protocols";
import { serverError, ok } from "@/presentation/helpers";
import { ListAccounts } from "@/domain/usecases";

export class ListAccountsController implements Controller {
  constructor(private listAccountsUseCase: ListAccounts) {}

  async handle(): Promise<HttpResponse> {
    try {
      const listAccounts = await this.listAccountsUseCase.execute();

      return ok(listAccounts);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
