import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThrottlerModule } from "@nestjs/throttler";
import { EmployeesController } from "./employees.controller";
import { EmployeesService } from "./employees.service";
import { EmployeesRepository } from "./repositories/employees.repository";
import { Employee } from "./entities/employee.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesRepository],
  exports: [EmployeesService, EmployeesRepository],
})
export class EmployeesModule {}
