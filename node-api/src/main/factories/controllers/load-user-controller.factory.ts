import { makeDbLoadUserByEmail } from "@/main/factories";
import { Controller } from "@/presentation/protocols";
import { LoadUserController } from "@/presentation/controllers/load-user-controller";
import { makeLoadUserValidation } from "./load-user-validation-factory";

export const makeLoadUserController = async (): Promise<Controller> => {
  const loadUserByEmail = makeDbLoadUserByEmail();
  const controller = new LoadUserController(
    loadUserByEmail,
    makeLoadUserValidation()
  );
  return controller;
};
