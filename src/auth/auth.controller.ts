import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

// AuthController handles authentication endpoints (login, register)
// Provides JWT-based authentication for users
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User login endpoint
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "User login" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // User registration endpoint
  @Post("register")
  @ApiOperation({ summary: "User registration" })
  @ApiResponse({ status: 201, description: "Registration successful" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "User already exists" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
