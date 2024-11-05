import { TransactionController } from "@/presentation/controllers/transaction-controller";
import { Controller } from "@/presentation/protocols";
import { makeTransactionValidation } from "./transaction-validation-factory";
import { makeTransactionQueue } from "../queue/transactionQueueRepository-factory";

export const makeTransactionController = async (): Promise<Controller> => {
  const transactionQueueRepository = await makeTransactionQueue();
  const controller = new TransactionController(
    makeTransactionValidation(),
    transactionQueueRepository
  );
  return controller;
};
