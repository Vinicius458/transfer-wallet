CREATE DATABASE IF NOT EXISTS wallet;
USE wallet;

CREATE TABLE IF NOT EXISTS accounts (
    id CHAR(36) PRIMARY KEY,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    version INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255),
    account UUID UNIQUE,
    FOREIGN KEY (account) REFERENCES accounts(id) ON DELETE CASCADE
);

 CREATE TABLE IF NOT EXISTS transactions (
    id CHAR(36) PRIMARY KEY,
    accountId VARCHAR(255) NOT NULL, 
    targetAccountId VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL, 
    type VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);