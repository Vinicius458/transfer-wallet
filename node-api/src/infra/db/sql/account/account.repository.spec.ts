// src/data/repositories/AccountRepository.integration.spec.ts
import { DataSource } from "typeorm";
import { DBAccountRepository } from "./account.repository";
import { Account as AccountEntity } from "./account.entity";
import { Account } from "@/domain/entities/account/account";
import { initializeTestDataSource } from "../config";

describe("AccountRepository Integration Tests", () => {
  let dataSource: DataSource;
  let accountRepository: DBAccountRepository;

  beforeAll(async () => {
    dataSource = await initializeTestDataSource();
    accountRepository = new DBAccountRepository(dataSource);
  });

  afterAll(async () => {
    (await initializeTestDataSource()).destroy();
  });

  beforeEach(async () => {
    // Limpa a tabela antes de cada teste para evitar interferência entre eles
    await dataSource.getRepository(AccountEntity).clear();
  });

  it("Should create a new account and save it in the database", async () => {
    const account = new Account(100.0);
    const savedAccount = await accountRepository.saveAccount(account);
    expect(savedAccount).toBeInstanceOf(Account);
    expect(savedAccount.balance).toBe(100.0);

    const foundAccount = await accountRepository.findById(savedAccount.id);
    expect(foundAccount).toBeDefined();
    expect(foundAccount?.balance).toBe(100.0);
  });

  it("Should update the balance of an existing account and maintain version consistency", async () => {
    const account = new Account(200.0);
    await accountRepository.saveAccount(account);

    account.credit(50.0);
    const success = await accountRepository.updateAccount(account);
    expect(success).toBe(true);
    const updatedAccount = await accountRepository.findById(account.id);
    expect(updatedAccount?.balance).toBe(250.0);
    expect(updatedAccount?.getVersion()).toBe(2);

    if (updatedAccount) {
      updatedAccount?.debit(50.0);
      const secondUpdateSuccess =
        await accountRepository.updateAccount(updatedAccount);
      expect(secondUpdateSuccess).toBe(true);
      const outdatedAccount = await accountRepository.findById(account.id);
      expect(outdatedAccount?.balance).toBe(200.0);
      expect(updatedAccount?.getVersion()).toBe(3);
    }
  });

  it("should throw an error when trying to update an account with an outdated version", async () => {
    const account = new Account(300.0);
    await accountRepository.saveAccount(account);

    const outdatedAccount = await accountRepository.findById(account.id);
    if (outdatedAccount) {
      outdatedAccount.credit(50.0);
      await accountRepository.updateAccount(outdatedAccount);
    }

    account.credit(50.0);

    const updateAccount = await accountRepository.updateAccount(account);
    expect(updateAccount).toBe(false);
  });
  it("should return a list of accounts", async () => {
    const account = new Account(100.0);
    const savedAccount = await accountRepository.saveAccount(account);

    const accounts = await accountRepository.list();

    expect(accounts).toBeTruthy();
    expect(accounts).toHaveLength(1);
    expect(accounts[0].id).toBe(savedAccount.id);
    expect(accounts[0].balance).toBe(savedAccount.balance);
  });

  it("should return null if there are no accounts", async () => {
    const accounts = await accountRepository.list();

    expect(accounts).toHaveLength(0);
  });
});
