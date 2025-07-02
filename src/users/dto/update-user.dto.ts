import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsOptional, IsBoolean } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: "User active status" })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
