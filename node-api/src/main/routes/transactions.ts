import { adaptRoute } from "@/main/adapters";
import {
  makeListTransactionsController,
  makeTransactionController,
} from "@/main/factories";

import { Router } from "express";

export default async (router: Router): Promise<void> => {
  const transactionController = await makeTransactionController();
  const listTransactionsController = await makeListTransactionsController();
  router.get("/transaction", adaptRoute(listTransactionsController));
  router.post("/transaction", adaptRoute(transactionController));
};
