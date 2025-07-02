import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async check() {
    const dbStatus = await this.checkDatabase();

    const isHealthy = dbStatus.status === "up";

    const dbOptions = this.dataSource.options as any;
    const dbUrl = dbOptions.url || '';
    
    let dbHost = 'N/A';
    let dbName = 'N/A';
    
    if (dbUrl && dbUrl.includes('@')) {
      const hostPart = dbUrl.split('@')[1];
      dbHost = hostPart.split('/')[0];
      dbName = hostPart.split('/')[1]?.split('?')[0] || 'N/A';
    } else if (dbOptions.host) {
      dbHost = dbOptions.host;
      dbName = dbOptions.database || 'N/A';
    }

    return {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      database: {
        type: dbOptions.type,
        host: dbHost,
        database: dbName,
        status: dbStatus.status,
        timestamp: dbStatus.timestamp,
      },
      checks: {
        database: dbStatus,
      },
    };
  }

  async ready() {
    const dbStatus = await this.checkDatabase();

    if (dbStatus.status !== "up") {
      throw new Error("Application is not ready");
    }

    return {
      status: "ready",
      timestamp: new Date().toISOString(),
    };
  }

  async live() {
    return {
      status: "alive",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  private async checkDatabase() {
    try {
      await this.dataSource.query("SELECT 1");
      return {
        status: "up",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "down",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
