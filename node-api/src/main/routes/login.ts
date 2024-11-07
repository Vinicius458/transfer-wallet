import { adaptRoute } from "@/main/adapters";
import { makeLoginController, makeSignUpController } from "@/main/factories";

import { Router } from "express";

export default async (router: Router): Promise<void> => {
  const signUpController = await makeSignUpController();
  const loginController = await makeLoginController();
  router.post("/auth/signup", adaptRoute(signUpController));
  router.post("/auth/login", adaptRoute(loginController));
};
