import { Ctx, Hears, Message, On, Start, Update } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { Context } from 'telegraf';

@Update()
export class BotUpdate {
	constructor(private readonly botService: BotService) {}

	@Start()
	async start(ctx: Context) {
		console.log(ctx.from);
		await this.botService.start(ctx);
	}
	@Hears('/logs')
	async logs(ctx: Context) {
		if (+process.env.HOST === ctx.from.id) {
			await this.botService.sendLogs(ctx);
		} else {
			await ctx.reply('У вас нет доступа к этой команде');
		}
	}
	@Hears('/metr')
	async metr(ctx: Context) {
		if (+process.env.HOST === ctx.from.id) {
			await this.botService.sendMetric(ctx);
		} else {
			await ctx.reply('У вас нет доступа к этой команде');
		}
	}

	@On('text')
	async waitForPhone(@Ctx() ctx: Context, @Message('text') message: string) {
		await this.botService.listenPhone(ctx, message);
	}
}
