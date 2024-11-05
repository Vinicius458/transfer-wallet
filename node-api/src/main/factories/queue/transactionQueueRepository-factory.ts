import { TransactionQueueRepository } from "@/data/protocols/queue/transaction-queue-repository";
import { createRabbitMQChannel } from "@/infra/queue/rabbitMQConfig";
import { TransactionQueueRepositoryImpl } from "@/infra/queue/transactionQueueRepositoryImpl";
import { Channel } from "amqplib";

export const makeTransactionQueue =
  async (): Promise<TransactionQueueRepository> => {
    const channel: Channel = await createRabbitMQChannel();
    return new TransactionQueueRepositoryImpl(channel);
  };
