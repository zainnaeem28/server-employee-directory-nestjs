import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { HealthService } from "./health.service";

// HealthController provides endpoints for health, readiness, and liveness checks
// Used for monitoring and orchestration
@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  // Get application health status
  @Get()
  @ApiOperation({ summary: "Get application health status" })
  @ApiResponse({ status: 200, description: "Application is healthy" })
  @ApiResponse({ status: 503, description: "Application is unhealthy" })
  async check() {
    return this.healthService.check();
  }

  // Get application readiness status
  @Get("ready")
  @ApiOperation({ summary: "Get application readiness status" })
  @ApiResponse({ status: 200, description: "Application is ready" })
  @ApiResponse({ status: 503, description: "Application is not ready" })
  async ready() {
    return this.healthService.ready();
  }

  // Get application liveness status
  @Get("live")
  @ApiOperation({ summary: "Get application liveness status" })
  @ApiResponse({ status: 200, description: "Application is alive" })
  async live() {
    return this.healthService.live();
  }
}
