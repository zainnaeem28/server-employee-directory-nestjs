import { PartialType } from "@nestjs/swagger";
import { CreateEmployeeDto } from "./create-employee.dto";
import { IsOptional, IsBoolean } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @ApiPropertyOptional({ description: "Employee active status" })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
