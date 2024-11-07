import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUser1730908004351 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            length: "255",
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
            length: "255",
          },
          {
            name: "token",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "accountId",
            type: "uuid",
            isUnique: true,
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ["account"],
            referencedTableName: "accounts",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
