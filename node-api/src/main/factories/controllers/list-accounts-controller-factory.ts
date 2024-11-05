import { Controller } from "@/presentation/protocols";
import { makeListAccounts } from "../usecases";
import { ListAccountsController } from "@/presentation/controllers/list-accounts-controller";

export const makeListAccountsController = async (): Promise<Controller> => {
  const makeListAccountsUseCase = await makeListAccounts();
  const controller = new ListAccountsController(makeListAccountsUseCase);
  return controller;
};
