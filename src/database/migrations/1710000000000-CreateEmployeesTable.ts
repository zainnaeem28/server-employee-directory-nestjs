import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateEmployeesTable1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "employees",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "firstName",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "lastName",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            length: "255",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "phone",
            type: "varchar",
            length: "20",
            isNullable: false,
          },
          {
            name: "department",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "title",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "location",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "avatar",
            type: "varchar",
            length: "500",
            isNullable: false,
          },
          {
            name: "hireDate",
            type: "date",
            isNullable: false,
          },
          {
            name: "salary",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: "manager",
            type: "varchar",
            length: "100",
            isNullable: true,
          },
          {
            name: "isActive",
            type: "boolean",
            default: true,
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create indexes for better performance
    await queryRunner.query(
      "CREATE INDEX IDX_EMPLOYEES_DEPARTMENT ON employees(department)",
    );
    await queryRunner.query(
      "CREATE INDEX IDX_EMPLOYEES_EMAIL ON employees(email)",
    );
    await queryRunner.query(
      "CREATE INDEX IDX_EMPLOYEES_NAME ON employees(firstName, lastName)",
    );
    await queryRunner.query(
      "CREATE INDEX IDX_EMPLOYEES_CREATED_AT ON employees(createdAt)",
    );

    // Create full-text search index for better search performance
    await queryRunner.query(`
      CREATE INDEX IDX_EMPLOYEES_SEARCH 
      ON employees 
      USING gin(to_tsvector('english', firstName || ' ' || lastName || ' ' || email || ' ' || phone))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query("DROP INDEX IF EXISTS IDX_EMPLOYEES_SEARCH");
    await queryRunner.query("DROP INDEX IF EXISTS IDX_EMPLOYEES_CREATED_AT");
    await queryRunner.query("DROP INDEX IF EXISTS IDX_EMPLOYEES_NAME");
    await queryRunner.query("DROP INDEX IF EXISTS IDX_EMPLOYEES_EMAIL");
    await queryRunner.query("DROP INDEX IF EXISTS IDX_EMPLOYEES_DEPARTMENT");

    // Drop table
    await queryRunner.dropTable("employees");
  }
}
