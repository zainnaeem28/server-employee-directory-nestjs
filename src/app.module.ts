/*
# @Author: Muhammad Zain Naeem PMP®, APMC® <zain.naeem@invozone.dev>
# @Role: Senior Software Engineer, Designer & Writer
# @GitHub: https://github.com/scriptsamurai28
# @CodeStats: https://codestats.net/users/scriptsamurai28
# @Date: July 04, 2025
# @Version: 1.0.0
# @Status: Production Ready ✅
#
# 💡 "Code is poetry written in logic"
# 📍 Built with ❤️ in Lahore, Pakistan
# 🎯 Turning ideas into digital reality
*/
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
            synchronize: false, // Disabled in production - use migrations instead
            logging: false,
            migrations: ["src/database/migrations/*.ts"],
            migrationsRun: true,
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
