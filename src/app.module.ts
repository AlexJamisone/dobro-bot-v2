import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { QuickrestoModule } from './quickresto/quickresto.module';
@Module({
	imports: [BotModule, QuickrestoModule],
})
export class AppModule {}
