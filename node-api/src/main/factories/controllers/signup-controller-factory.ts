import {
  makeDbAuthentication,
  makeSignUpValidation,
  makeAddUser,
} from "@/main/factories";
import { SignUpController } from "@/presentation/controllers";
import { Controller } from "@/presentation/protocols/controller";

export const makeSignUpController = async (): Promise<Controller> => {
  const addUser = await makeAddUser();
  const signUpValidation = makeSignUpValidation();
  const authentication = await makeDbAuthentication();
  const controller = new SignUpController(
    addUser,
    signUpValidation,
    authentication
  );
  return controller;
};
