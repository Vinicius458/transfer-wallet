import { adaptRoute } from "@/main/adapters";
import {
  makeAddAccountController,
  makeListAccountsController,
} from "@/main/factories";

import { Router } from "express";

export default async (router: Router): Promise<void> => {
  const addAccountController = await makeAddAccountController();
  const listAccountsController = await makeListAccountsController();
  router.get("/account", adaptRoute(listAccountsController));
  router.post("/account", adaptRoute(addAccountController));
};
