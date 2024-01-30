import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import LocalSession from 'telegraf-session-local';
import { QuickrestoService } from 'src/quickresto/quickresto.service';

const session = new LocalSession({
	database: 'session_db.json',
});
@Module({
	imports: [
		TelegrafModule.forRoot({
			middlewares: [session.middleware()],
			token: process.env.TOKEN,
		}),
	],
	providers: [BotService, QuickrestoService],
})
export class BotModule {}
