import { beforeAll, describe, expect, it } from "bun:test";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { AnalyticsController } from "../src/analytics/analytics.controller";
import { AnalyticsService } from "../src/analytics/analytics.service";
import { ClientsController } from "../src/clients/clients.controller";
import { ClientsService } from "../src/clients/clients.service";
import { InvoicesController } from "../src/invoices/invoices.controller";
import { InvoicesService } from "../src/invoices/invoices.service";
import { PdfModule } from "../src/pdf/pdf.module";
import { PrismaModule } from "../src/prisma/prisma.module";
import { UsersController } from "../src/users/users.controller";
import { UsersService } from "../src/users/users.service";

describe("AppController (e2e)", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
        }),
        PrismaModule,
        PdfModule,
      ],
      controllers: [
        AnalyticsController,
        ClientsController,
        InvoicesController,
        UsersController,
      ],
      providers: [
        AnalyticsService,
        ClientsService,
        InvoicesService,
        UsersService,
      ],
    }).compile();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });
});
