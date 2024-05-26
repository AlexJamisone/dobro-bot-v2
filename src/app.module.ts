import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { CronModule } from './cron/cron.module';
import { LoggerModule } from './logger/logger.module';
import { MetricModule } from './metric/metric.module';
@Module({
	imports: [BotModule, CronModule, LoggerModule, MetricModule],
})
export class AppModule {}
