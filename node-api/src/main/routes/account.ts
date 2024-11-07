import { adaptRoute } from "@/main/adapters";
import {
  makeListAccountsController,
  makeLoadUserController,
} from "@/main/factories";

import { Router } from "express";
import { auth } from "../middlewares";

export default async (router: Router): Promise<void> => {
  const listAccountsController = await makeListAccountsController();
  const loadUserController = await makeLoadUserController();
  router.get("/account", adaptRoute(listAccountsController));
  router.get("/user", auth, adaptRoute(loadUserController));
};
