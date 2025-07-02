import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "../src/app.module";
import { GlobalExceptionFilter } from "../src/common/filters/global-exception.filter";
import { LoggingInterceptor } from "../src/common/interceptors/logging.interceptor";

let app: any;

async function bootstrap() {
  if (!app) {
    const logger = new Logger("Bootstrap");

    try {
      app = await NestFactory.create(AppModule, {
        logger: ["error", "warn", "log", "debug", "verbose"],
      });

      app.use(helmet());

      app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(",") || [
          "http://localhost:3000",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      });

      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          transform: true,
          forbidNonWhitelisted: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
        }),
      );

      app.useGlobalFilters(new GlobalExceptionFilter());
      app.useGlobalInterceptors(new LoggingInterceptor());
      app.setGlobalPrefix("api/v1");

      const config = new DocumentBuilder()
        .setTitle("Employee Directory API")
        .setDescription("A comprehensive API for managing employee directory")
        .setVersion("1.0")
        .addTag("employees", "Employee management operations")
        .addTag("health", "Health check endpoints")
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup("api/docs", app, document);

      await app.init();

      logger.log(`🚀 Application is ready for serverless deployment`);
      logger.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
    } catch (error) {
      logger.error("Failed to start application:", error);
      throw error;
    }
  }
  return app;
}

export default async function handler(req: any, res: any) {
  try {
    const app = await bootstrap();
    const expressInstance = app.getHttpAdapter().getInstance();
    return expressInstance(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
} 