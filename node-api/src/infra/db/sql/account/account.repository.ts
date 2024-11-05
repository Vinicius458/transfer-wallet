import { Account } from "@/domain/entities/account/account";
import { Account as AccountEntity } from "./account.entity";
import { DataSource, Repository } from "typeorm";
import { AccountRepository } from "@/data/protocols";

export class DBAccountRepository implements AccountRepository {
  private ormRepository: Repository<AccountEntity>;

  constructor(private dataSource: DataSource) {
    this.ormRepository = this.dataSource.getRepository(AccountEntity);
  }
  async findById(id: string): Promise<Account | null> {
    const account = await this.ormRepository.find();
    const accountEntity = await this.ormRepository.findOne({ where: { id } });
    return accountEntity ? this.toDomain(accountEntity) : null;
  }

  async list(): Promise<Array<Account>> {
    const accountEntity = await this.ormRepository.find();
    return accountEntity.map((account) => this.toDomain(account));
  }

  async saveAccount(account: Account): Promise<Account> {
    const accountEntity = this.toEntity(account);
    const savedEntity = await this.ormRepository.save(accountEntity);
    return this.toDomain(savedEntity);
  }

  async updateAccount(account: Account): Promise<any> {
    const existingAccount = await this.findById(account.id);

    if (!existingAccount) {
      throw new Error("Conta não encontrada");
    }

    if (existingAccount.getVersion() === account.getVersion()) {
      account.incrementVersion();
      const accountEntity = this.toEntity(account);
      await this.ormRepository.save(accountEntity);
      return true;
    }

    return false;
  }

  private toDomain(accountEntity: AccountEntity): Account {
    const account = new Account(
      Number(accountEntity.balance),
      accountEntity.version
    );
    account.id = accountEntity.id;
    return account;
  }

  private toEntity(account: Account): AccountEntity {
    const accountEntity = new AccountEntity();
    accountEntity.id = account.id;
    accountEntity.balance = account.balance;
    accountEntity.version = account.getVersion();
    return accountEntity;
  }
}
