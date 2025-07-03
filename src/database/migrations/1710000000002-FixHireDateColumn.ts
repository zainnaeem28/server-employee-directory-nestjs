import { MigrationInterface, QueryRunner } from "typeorm";

export class FixHireDateColumn1710000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the table exists
    const tableExists = await queryRunner.hasTable("employees");
    if (!tableExists) {
      console.log("Employees table does not exist, skipping migration");
      return;
    }

    // Check if hireDate column exists
    const columnExists = await queryRunner.hasColumn("employees", "hireDate");
    if (!columnExists) {
      console.log("hireDate column does not exist, skipping migration");
      return;
    }

    try {
      // First, update any null hireDate values to a default date
      await queryRunner.query(`
        UPDATE employees 
        SET "hireDate" = '2024-01-01' 
        WHERE "hireDate" IS NULL
      `);
      console.log("Updated null hireDate values to default date");

      // Now change the column type to date (non-nullable)
      await queryRunner.query(`
        ALTER TABLE employees 
        ALTER COLUMN "hireDate" TYPE DATE USING "hireDate"::DATE,
        ALTER COLUMN "hireDate" SET NOT NULL
      `);
      console.log("Changed hireDate column to DATE type and made it NOT NULL");

    } catch (error) {
      console.error("Error in hireDate migration:", (error as Error).message);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      // Revert the column back to nullable text
      await queryRunner.query(`
        ALTER TABLE employees 
        ALTER COLUMN "hireDate" TYPE TEXT,
        ALTER COLUMN "hireDate" DROP NOT NULL
      `);
      console.log("Reverted hireDate column to TEXT type and made it nullable");
    } catch (error) {
      console.error("Error reverting hireDate migration:", (error as Error).message);
    }
  }
} 