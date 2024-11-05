import { Channel, ConsumeMessage } from "amqplib";
import { Transaction } from "@/domain/entities";
import { TransactionQueueRepository } from "@/data/protocols/queue/transaction-queue-repository";

export class TransactionQueueRepositoryImpl
  implements TransactionQueueRepository
{
  private channel: Channel;
  private readonly queueName = "transactions";
  private readonly queueNameDLQ = `${this.queueName}-DLQ`;

  constructor(channel: Channel) {
    this.channel = channel;
  }

  async enqueue(transaction: Transaction): Promise<void> {
    await this.channel.assertQueue(this.queueName, { durable: true });
    const message = JSON.stringify(transaction);
    this.channel.sendToQueue(this.queueName, Buffer.from(message));
  }

  async consume(
    callback: (transaction: Transaction) => Promise<void>,
    maxAttempts: number = 3
  ): Promise<void> {
    await this.channel.assertQueue(this.queueName, { durable: true });
    await this.channel.assertQueue(this.queueNameDLQ, { durable: true });
    this.channel.consume(this.queueName, async (msg: ConsumeMessage | null) => {
      if (msg) {
        const transactionData: Transaction = JSON.parse(msg.content.toString());
        const transaction = new Transaction(
          transactionData.accountId,
          transactionData.amount,
          transactionData.type,
          transactionData.targetAccountId
        );
        const attemptCount = (msg.properties.headers!["x-attempts"] || 0) + 1;

        try {
          await callback(transaction);
          this.channel.ack(msg);
        } catch (error) {
          console.error(
            `Erro ao processar transação (tentativa ${attemptCount}):`,
            error
          );

          if (attemptCount < maxAttempts) {
            this.channel.sendToQueue(this.queueName, msg.content, {
              headers: { "x-attempts": attemptCount },
            });
            this.channel.ack(msg);
          } else {
            this.channel.sendToQueue(this.queueNameDLQ, msg.content, {
              persistent: true,
            });
            this.channel.ack(msg);
          }
        }
      }
    });
  }
}
