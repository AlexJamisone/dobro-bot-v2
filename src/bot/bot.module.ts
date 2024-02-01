import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { QuickrestoService } from 'src/quickresto/quickresto.service';
import { ConfigModule } from '@nestjs/config';
import { BotUpdate } from './bot.update';

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
	],
	providers: [BotUpdate, BotService, QuickrestoService],
})
export class BotModule {}
