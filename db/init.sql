CREATE DATABASE IF NOT EXISTS bank;
USE bank;

CREATE TABLE IF NOT EXISTS accounts (
    id CHAR(36) PRIMARY KEY, 
    balance DECIMAL(10, 2) DEFAULT 0.00, 
    version INT DEFAULT 1
);

 CREATE TABLE IF NOT EXISTS transactions (
    id CHAR(36) PRIMARY KEY,
    accountId VARCHAR(255) NOT NULL, 
    targetAccountId VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL, 
    type VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

INSERT INTO accounts (id, balance, version) VALUES 
('10', 1000.00, 1);

INSERT INTO accounts (id, balance, version) VALUES 
('20', 500.00, 1);