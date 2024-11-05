import { Controller } from "@/presentation/protocols";
import { AddAcountController } from "@/presentation/controllers/add-accout-controller";
import { makeAddAccount } from "../usecases";

export const makeAddAccountController = async (): Promise<Controller> => {
  const makeAddAccountsUseCase = await makeAddAccount();
  const controller = new AddAcountController(makeAddAccountsUseCase);
  return controller;
};
