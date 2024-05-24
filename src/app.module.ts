import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { CronModule } from './cron/cron.module';
import { LoggerModule } from './logger/logger.module';
@Module({
	imports: [BotModule, CronModule, LoggerModule],
})
export class AppModule {}
