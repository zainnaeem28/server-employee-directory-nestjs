import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomAvatarColumn1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the column already exists to avoid errors
    const tableExists = await queryRunner.hasTable("employees");
    if (!tableExists) {
      console.log("Employees table does not exist, skipping migration");
      return;
    }

    const columnExists = await queryRunner.hasColumn("employees", "customAvatar");
    if (!columnExists) {
      await queryRunner.query(
        "ALTER TABLE employees ADD COLUMN customAvatar VARCHAR(500)"
      );
      console.log("Added customAvatar column to employees table");
    } else {
      console.log("customAvatar column already exists, skipping");
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columnExists = await queryRunner.hasColumn("employees", "customAvatar");
    if (columnExists) {
      await queryRunner.query(
        "ALTER TABLE employees DROP COLUMN customAvatar"
      );
      console.log("Dropped customAvatar column from employees table");
    }
  }
} 