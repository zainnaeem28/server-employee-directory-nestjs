import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsIn,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ description: "User email address" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User first name" })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ description: "User last name" })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ description: "User password" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: "User role",
    enum: ["admin", "user"],
    default: "user",
  })
  @IsOptional()
  @IsIn(["admin", "user"])
  role?: "admin" | "user";
}
