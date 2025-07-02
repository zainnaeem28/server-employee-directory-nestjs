import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThrottlerModule } from "@nestjs/throttler";
import { EmployeesModule } from "./employees/employees.module";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { Employee } from "./employees/entities/employee.entity";
import { User } from "./users/entities/user.entity";
import configuration from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = process.env.NODE_ENV || "development";
        const dbType = process.env.DB_TYPE;
        const databaseUrl = process.env.DATABASE_URL;
        
        if (nodeEnv === "development" || dbType === "sqlite" || !databaseUrl) {
          return {
            type: "sqlite",
            database: process.env.DB_NAME || "employee_directory.db",
            entities: [Employee, User],
            synchronize: true,
            logging: nodeEnv === "development",
          };
        } else {
          return {
            type: "postgres",
            url: databaseUrl,
            entities: [Employee, User],
            synchronize: false,
            logging: false,
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    EmployeesModule,
    HealthModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
