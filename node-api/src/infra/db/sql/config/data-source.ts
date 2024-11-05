import "reflect-metadata";
import { DataSource } from "typeorm";
import { Account } from "../account/account.entity";
import { Transaction } from "../transaction/transaction.entity";
import { CreateAccountTable_ts1730120866869 } from "../migration/1730120866869-createAccountTable.ts";
import { CreateTransactionTable_ts1730121190957 } from "../migration/1730121190957-createTransactionTable.ts";
import env from "@/main/config/env";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.dbHost,
  port: env.dbPort,
  username: env.dbUser,
  password: env.dbPassword,
  database: env.dbName, // banco de dados para teste
  entities: [Account, Transaction],
  synchronize: false, // cria as tabelas automaticamente no banco de teste
  migrations: [
    CreateAccountTable_ts1730120866869,
    CreateTransactionTable_ts1730121190957,
  ],
});

export const initializeTestDataSource = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } else {
    console.log("Data Source is already initialized.");
  }
  return AppDataSource;
};
