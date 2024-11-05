import { Controller } from "@/presentation/protocols";
import { makeListTransactions } from "../usecases/list-transactions-factory";
import { ListTransactionsController } from "@/presentation/controllers/list-transactions-cotroller";

export const makeListTransactionsController = async (): Promise<Controller> => {
  const makeListTransactionsUseCase = await makeListTransactions();
  const controller = new ListTransactionsController(
    makeListTransactionsUseCase
  );
  return controller;
};
