import { IsOptional, IsString, IsNumber, Min, Max } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class EmployeeFiltersDto {
  @ApiPropertyOptional({ description: "Filter by department" })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: "Filter by job title" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: "Filter by location" })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: "Search in name, email, or phone" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: "Page number", default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: "Items per page", default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
