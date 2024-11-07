import { makeDbAuthentication, makeLoginValidation } from "@/main/factories";
import { Controller } from "@/presentation/protocols";
import { LoginController } from "@/presentation/controllers";

export const makeLoginController = async (): Promise<Controller> => {
  const authentication = await makeDbAuthentication();
  const controller = new LoginController(authentication, makeLoginValidation());
  return controller;
};
