import { Injectable } from '@nestjs/common';
import response from 'src/constant/response';
import { QuickrestoService } from 'src/quickresto/quickresto.service';
import { Context } from 'telegraf';

@Injectable()
export class BotService {
	constructor(private readonly qrService: QuickrestoService) {}
	async start(ctx: Context) {
		return await ctx.reply(response.welcome());
	}
	async listenPhone(ctx: Context, message: string) {
		if (message.length === 12) {
			const { name, bonuses, error, noCustomer } =
				await this.qrService.getUser(message);
			if (noCustomer) {
				await ctx.reply(response.notFound(message));
				return;
			}
			if (error) {
				await ctx.reply(error);
				return;
			}
			if (name || bonuses) {
				return await ctx.reply(response.respone(name, bonuses));
			}
		} else {
			return await ctx.reply(
				'Извините, 🤖 мне неизвестна данная команда. Попробуйте еще раз или уточните запрос.',
			);
		}
	}
}
