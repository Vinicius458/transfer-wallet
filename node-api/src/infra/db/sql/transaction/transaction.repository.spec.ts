import { DataSource } from "typeorm";
import { DBTransactionRepository } from "./transaction.repository";
import { Transaction, TransactionType } from "@/domain/entities";
import { Transaction as TransactionEntity } from "./transaction.entity";
import { initializeTestDataSource } from "../config";

let dataSource: DataSource;
let transactionRepository: DBTransactionRepository;

beforeAll(async () => {
  dataSource = await initializeTestDataSource();
  transactionRepository = new DBTransactionRepository(dataSource);
});

afterAll(async () => {
  (await initializeTestDataSource()).destroy();
});

beforeEach(async () => {
  await dataSource.getRepository(TransactionEntity).clear();
});

describe("DBTransactionRepository", () => {
  it("should save a transaction and retrieve it correctly", async () => {
    const transaction = new Transaction(
      "1",
      100.0,
      TransactionType.DEPOSIT,
      "2",
      new Date()
    );

    const savedTransaction =
      await transactionRepository.saveTransaction(transaction);

    expect(savedTransaction.accountId).toBe(transaction.accountId);
    expect(savedTransaction.amount).toBe(transaction.amount);
    expect(savedTransaction.type).toBe(transaction.type);
    expect(savedTransaction.targetAccountId).toBe(transaction.targetAccountId);
  });

  it("should return a list of transactions", async () => {
    const transaction = new Transaction(
      "1",
      100.0,
      TransactionType.DEPOSIT,
      "2",
      new Date()
    );
    const savedTransaction =
      await transactionRepository.saveTransaction(transaction);
    const transactions = await transactionRepository.listTransaction();

    expect(transactions).toBeTruthy();
    expect(transactions).toHaveLength(1);
    expect(transactions[0].id).toBe(savedTransaction.id);
    expect(transactions[0].amount).toBe(savedTransaction.amount);
  });

  it("should return null if there are no transactions", async () => {
    const transactions = await transactionRepository.listTransaction();

    expect(transactions).toHaveLength(0);
  });
});
