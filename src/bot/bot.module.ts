import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { ConfigModule } from '@nestjs/config';
import { QuickrestoModule } from 'src/quickresto/quickresto.module';

const session = new LocalSession({
	database: 'session_db.json',
});
@Module({
	imports: [
		ConfigModule.forRoot(),
		TelegrafModule.forRoot({
			middlewares: [session.middleware()],
			token: process.env.TOKEN,
		}),
		QuickrestoModule,
	],
	providers: [BotService],
})
export class BotModule {}
