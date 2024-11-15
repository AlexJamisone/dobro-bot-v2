import { Injectable } from '@nestjs/common';
import response from 'src/constant/response';
import { LoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuickrestoService } from 'src/quickresto/quickresto.service';
import { Context, Markup } from 'telegraf';

@Injectable()
export class BotService {
	constructor(
		private readonly qrService: QuickrestoService,
		private readonly logger: LoggerService,
		private readonly db: PrismaService,
	) {}
	async start(ctx: Context) {
		const markup = Markup.inlineKeyboard(
			[
				{ url: 'https://dobro-coffee.shop/tips', text: 'Чаевые' },
				{ url: 'https://dobro-coffee.shop/yandex', text: 'Отзывы' },
			],
			{
				columns: 2,
			},
		);
		return await ctx.reply(response.welcome(), markup);
	}
	async sendLogs(ctx: Context) {
		const logs = this.logger.getLogs();
		const formattedLogs = `\`\`\`${logs}\`\`\``;
		await ctx.reply(formattedLogs, { parse_mode: 'MarkdownV2' });
	}
	async sendMetric(ctx: Context) {
		const { nextUrl, count } = await this.db.getMetric();
		ctx.reply(`В данный момент использовали ${count} раз`, {
			reply_markup: {
				inline_keyboard: [
					[{ url: nextUrl, text: 'Актуальная корзина' }],
				],
			},
		});
	}
	async listenPhone(ctx: Context, message: string) {
		if (message.length === 12) {
			const { name, bonuses, error, noCustomer } =
				await this.qrService.getUser(message);
			await this.db.inc();
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
