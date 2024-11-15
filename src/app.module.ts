import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { CronModule } from './cron/cron.module';
import { LoggerModule } from './logger/logger.module';
import { ApiModule } from './api/api.module';
@Module({
	imports: [BotModule, CronModule, LoggerModule, ApiModule],
})
export class AppModule {}
