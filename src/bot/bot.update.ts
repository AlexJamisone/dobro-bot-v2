import { Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { BotService } from './bot.service';
import { Context } from 'telegraf';

@Update()
export class BotUpdate {
	constructor(private readonly botService: BotService) {}
	@Start()
	async start(ctx: Context) {
		await this.botService.start(ctx)
	}
    @On("text")
    async waitForPhone(@Ctx() ctx: Context, @Message("text") message: string) {
        await this.botService.listenPhone(ctx, message)
    }
}
