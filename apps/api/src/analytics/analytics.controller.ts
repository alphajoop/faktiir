import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AnalyticsService } from "./analytics.service";

@ApiTags("Analytics")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("analytics")
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: "Get dashboard analytics" })
  getAnalytics(@Request() req, @Query("year") year?: string) {
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.analyticsService.getAnalytics(req.user.id, y);
  }
}
