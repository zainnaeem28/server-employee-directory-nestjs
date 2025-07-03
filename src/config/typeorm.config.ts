import { DataSource } from "typeorm";
import { Employee } from "../employees/entities/employee.entity";
import { User } from "../users/entities/user.entity";
import { CreateEmployeesTable1710000000000 } from "../database/migrations/1710000000000-CreateEmployeesTable";
import { AddCustomAvatarColumn1710000000001 } from "../database/migrations/1710000000001-AddCustomAvatarColumn";
import { FixHireDateColumn1710000000002 } from "../database/migrations/1710000000002-FixHireDateColumn";

const databaseUrl = process.env.DATABASE_URL;
const nodeEnv = process.env.NODE_ENV || "development";

if (!databaseUrl && nodeEnv === "production") {
  throw new Error("DATABASE_URL is required in production");
}

export default new DataSource({
  type: "postgres",
  url: databaseUrl,
  entities: [Employee, User],
  migrations: [
    CreateEmployeesTable1710000000000,
    AddCustomAvatarColumn1710000000001,
    FixHireDateColumn1710000000002,
  ],
  synchronize: false,
  logging: nodeEnv === "development",
  ssl: {
    rejectUnauthorized: false,
  },
}); 