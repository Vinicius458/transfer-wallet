import { DataSource, Repository } from "typeorm";
import { Transaction, TransactionType } from "@/domain/entities";
import { Transaction as TransactionEntity } from "./transaction.entity";
import { TransactionRepository } from "@/data/protocols";

export class DBTransactionRepository implements TransactionRepository {
  private readonly repository: Repository<TransactionEntity>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(TransactionEntity);
  }

  async saveTransaction(transaction: Transaction): Promise<Transaction> {
    const transactionEntity = this.toEntity(transaction);
    const savedEntity = await this.repository.save(transactionEntity);
    return this.toDomain(savedEntity);
  }

  async listTransaction(): Promise<Array<Transaction>> {
    const transactionEntity = await this.repository.find();
    return transactionEntity.map((transaction) => this.toDomain(transaction));
  }

  private toEntity(transaction: Transaction): TransactionEntity {
    const transactionEntity = new TransactionEntity();
    transactionEntity.id = transaction.id;
    transactionEntity.accountId = transaction.accountId;
    transactionEntity.amount = transaction.amount;
    transactionEntity.createdAt = transaction.createdAt;
    transactionEntity.targetAccountId = transaction.targetAccountId;
    transactionEntity.type = transaction.type;

    return transactionEntity;
  }

  private toDomain(transactionEntity: TransactionEntity): Transaction {
    const transaction = new Transaction(
      transactionEntity.accountId,
      Number(transactionEntity.amount),
      transactionEntity.type as TransactionType,
      transactionEntity.targetAccountId,
      transactionEntity.createdAt
    );
    transaction.id = transactionEntity.id;
    return transaction;
  }
}
