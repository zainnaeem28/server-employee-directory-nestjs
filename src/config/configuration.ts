import { registerAs } from "@nestjs/config";

export interface DatabaseConfig {
  type: "sqlite" | "postgresql" | "mysql";
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

export interface SecurityConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
  corsOrigins: string[];
  rateLimitWindow: number;
  rateLimitMax: number;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  apiPrefix: string;
  randomUserApiUrl: string;
}

export interface LoggingConfig {
  level: string;
  format: "json" | "simple";
  enableConsole: boolean;
  enableFile: boolean;
  logFilePath?: string;
}

export default registerAs("app", () => ({
  port: parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  apiPrefix: process.env.API_PREFIX || "api/v1",
  randomUserApiUrl:
    process.env.RANDOM_USER_API_URL || "https://randomuser.me/api",

  database: {
    type: process.env.DB_TYPE || "sqlite",
    host: process.env.DB_HOST || undefined,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    username: process.env.DB_USERNAME || undefined,
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_NAME || "employee_directory.db",
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV === "development",
  },

  security: {
    jwtSecret: process.env.JWT_SECRET || (() => {
      throw new Error('JWT_SECRET is required');
    })(),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12", 10),
    corsOrigins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",")
      : ["http://localhost:3000"],
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || "900000", 10), // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "json",
    enableConsole: process.env.LOG_ENABLE_CONSOLE !== "false",
    enableFile: process.env.LOG_ENABLE_FILE === "true",
    logFilePath: process.env.LOG_FILE_PATH || "logs/app.log",
  },
}));
