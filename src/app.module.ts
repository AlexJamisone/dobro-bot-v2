import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { QuickrestoModule } from './quickresto/quickresto.module';
import { PrismaModule } from './prisma/prisma.module';
import { WrapapiModule } from './wrapapi/wrapapi.module';
import { CronModule } from './cron/cron.module';
@Module({
	imports: [
		BotModule,
		QuickrestoModule,
		PrismaModule,
		WrapapiModule,
		CronModule,
	],
})
export class AppModule {}
