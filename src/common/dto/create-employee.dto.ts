import {
  IsString,
  IsEmail,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  MinLength,
  Matches,
  IsIn,
  IsPositive,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateEmployeeDto {
  @ApiProperty({
    description: "Employee first name",
    example: "John",
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: "First name must contain only letters and spaces",
  })
  firstName: string;

  @ApiProperty({
    description: "Employee last name",
    example: "Doe",
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: "Last name must contain only letters and spaces",
  })
  lastName: string;

  @ApiProperty({
    description: "Employee email address",
    example: "john.doe@company.com",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;

  @ApiProperty({
    description: "Employee phone number",
    example: "+1-555-123-4567",
  })
  @IsString()
  @MinLength(1)
  phone: string;

  @ApiProperty({
    description: "Employee department",
    example: "Engineering",
    enum: [
      "Engineering",
      "Marketing",
      "Sales",
      "HR",
      "Finance",
      "Operations",
      "Design",
      "Product",
    ],
  })
  @IsString()
  @IsIn(
    [
      "Engineering",
      "Marketing",
      "Sales",
      "HR",
      "Finance",
      "Operations",
      "Design",
      "Product",
    ],
    {
      message: "Department must be one of the allowed values",
    },
  )
  department: string;

  @ApiProperty({
    description: "Employee job title",
    example: "Software Engineer",
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: "Employee location",
    example: "New York, USA",
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  location: string;

  @ApiProperty({
    description: "Employee salary in USD",
    example: 75000,
    minimum: 20000,
    maximum: 1000000,
  })
  @IsNumber()
  @IsPositive()
  @Min(20000)
  salary: number;

  @ApiPropertyOptional({
    description: "Employee manager name",
    example: "Jane Smith",
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  manager?: string;

  @ApiPropertyOptional({
    description: "Custom avatar URL for the employee (optional)",
    example: "https://randomuser.me/api/portraits/men/1.jpg",
  })
  @IsOptional()
  @IsString()
  customAvatar?: string;
}
