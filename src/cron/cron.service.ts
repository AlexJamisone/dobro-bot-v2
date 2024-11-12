import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectBot } from 'nestjs-telegraf';
import { compareStrings } from 'src/constant/helper';
import { LoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuickrestoService } from 'src/quickresto/quickresto.service';
import { Processed } from 'src/quickresto/quickresto.types';
import { WrapapiService } from 'src/wrapapi/wrapapi.service';
import { CoffeeInfo } from 'src/wrapapi/wrapapi.type';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class CronService {
	constructor(
		private readonly wrapapi: WrapapiService,
		private readonly quickresto: QuickrestoService,
		private readonly prisma: PrismaService,
		private readonly logger: LoggerService,
		@InjectBot() private bot: Telegraf<Context>,
	) {}
	// @Cron('0 */2 * * *')
	@Cron(CronExpression.EVERY_MINUTE)
	async handlUpdatePrice() {
		this.logger.verbose('Start Cron task');
		// const coffees = await this.merge();
		// await this.prisma.upsertCoffeesInDb({ coffees });
		// this.logger.verbose('Finish upsert coffee in db ✅');
		// parser not work
		await this.quickresto.updateMinimalPrice();
		this.logger.verbose('End cron Task');
	}
	@Cron('0 0 * * *')
	handlClearLogs() {
		this.logger.clear();
	}
	@Cron('0 9 1 * *')
	async handlMetric() {
		const count: number = await this.prisma.getMetric();
		await this.bot.telegram.sendMessage(
			process.env.HOST,
			`За месяц сервис использовали ${count} раз. •ᴗ•`,
		);
		await this.bot.telegram.sendMessage(
			process.env.HOST1,
			`За месяц сервис использовали ${count} раз. •ᴗ•`,
		);
		await this.prisma.clearMetric();
	}
	private async merge() {
		this.logger.verbose('Pull from wrap api...');
		const wrap = this.wrapapi.getCoffeeInfo();
		this.logger.verbose('Done ✅');
		this.logger.verbose('Pull ids from quickresto...');
		const qr = this.quickresto.extractIdFromQR();
		this.logger.verbose('Done ✅');
		const result: (Processed & CoffeeInfo)[] = [];
		const [w, q] = await Promise.all([wrap, qr]);
		for (const coffee of w) {
			for (const quickresto of q) {
				if (compareStrings(coffee.name, quickresto.name)) {
					result.push({
						Iid: quickresto.Iid,
						qid: quickresto.qid,
						name: coffee.name,
						img: coffee.img,
						info: coffee.info,
						type: coffee.type,
						price: coffee.price,
						success: coffee.success,
						description: coffee.description,
					});
				}
			}
		}
		return result;
	}
}
