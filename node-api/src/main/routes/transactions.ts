import { adaptRoute } from "@/main/adapters";
import {
  makeListTransactionsController,
  makeTransactionController,
} from "@/main/factories";

import { Router } from "express";
import { auth } from "../middlewares";

export default async (router: Router): Promise<void> => {
  const transactionController = await makeTransactionController();
  const listTransactionsController = await makeListTransactionsController();
  router.get("/transaction", auth, adaptRoute(listTransactionsController));
  router.post("/transaction", auth, adaptRoute(transactionController));
};
