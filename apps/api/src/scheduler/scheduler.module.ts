import { Module } from "@nestjs/common";
import { MailModule } from "../mail/mail.module";
import { SchedulerService } from "./scheduler.service";

@Module({
  imports: [MailModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
