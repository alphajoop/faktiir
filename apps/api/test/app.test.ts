import { beforeAll, describe, expect, it } from "bun:test";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

describe("AppController (e2e)", () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });
});
