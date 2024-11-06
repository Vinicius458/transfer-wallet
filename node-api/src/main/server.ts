import { setupApp } from "./config/app";
import "dotenv/config";
import env from "@/main/config/env";
import dotenv from "dotenv";
import { TransactionConsumer } from "@/infra/queue/transaction-consumer";
import { makeTransactionQueue } from "./factories/queue/transactionQueueRepository-factory";
import { closeRabbitMQ } from "@/infra/queue/rabbitMQConfig";
import { AppDataSource } from "@/infra/db/sql/config";
dotenv.config();
const port = env.port;
const app = setupApp();
async function initializeApp() {
  await AppDataSource.initialize();

  const transactionQueueRepository = await makeTransactionQueue();
  const trasactionConsumer = new TransactionConsumer(
    transactionQueueRepository
  );
  await trasactionConsumer.startTransactionConsumer();

  process.on("SIGINT", async () => {
    await closeRabbitMQ();
    process.exit(0);
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}
initializeApp();
