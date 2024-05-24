import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { CronModule } from './cron/cron.module';
@Module({
	imports: [BotModule, CronModule],
})
export class AppModule {}
