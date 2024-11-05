import { Controller, HttpResponse } from "@/presentation/protocols";
import { serverError, ok } from "@/presentation/helpers";
import { AddAccount } from "@/domain/usecases";

export class AddAcountController implements Controller {
  constructor(private addAccountUseCase: AddAccount) {}

  async handle(request: AddAcountController.Request): Promise<HttpResponse> {
    try {
      const createdAccount = await this.addAccountUseCase.execute(request);

      return ok({ id: createdAccount.accountId });
    } catch (error: any) {
      console.log(error);
      return serverError(error);
    }
  }
}

export namespace AddAcountController {
  export type Request = {
    accountId: string;
    balance: number;
  };
}
