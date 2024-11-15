import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectBot } from 'nestjs-telegraf';
import { compareStrings } from 'src/constant/helper';
import { LoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuickrestoService } from 'src/quickresto/quickresto.service';
import { Processed } from 'src/quickresto/quickresto.types';
import { Context, Telegraf } from 'telegraf';
import axios, { type AxiosInstance } from 'axios';

@Injectable()
export class CronService {
	constructor(
		private readonly quickresto: QuickrestoService,
		private readonly prisma: PrismaService,
		private readonly logger: LoggerService,
		@InjectBot() private bot: Telegraf<Context>,
	) {
		this.backend = axios.create({
			baseURL: process.env.BACKEND,
			auth: {
				username: process.env.AUTH_USERNAME,
				password: process.env.AUTH_PASSWORD,
			},
		});
	}
	private backend: AxiosInstance;
	@Cron(CronExpression.EVERY_7_HOURS)
	async handlUpdatePrice() {
		this.logger.verbose('Start Cron task');
		const coffees = await this.merge();
		await this.prisma.upsertCoffeesInDb({ coffees });
		this.logger.verbose('Finish upsert coffee in db ✅');
		await this.quickresto.updateMinimalPrice();
		this.logger.verbose('End cron Task');
	}
	@Cron('0 0 * * *')
	handlClearLogs() {
		this.logger.clear();
	}
	@Cron('0 9 1 * *')
	async handlMetric() {
		const { count } = await this.prisma.getMetric();
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
		try {
			const { nextUrl, id } = await this.prisma.metric.findFirst({
				select: { nextUrl: true, id: true },
			});
			if (!nextUrl) {
				throw new Error('Parse url emty');
			}
			const coffees = this.backend.post<DataFromBackend>(
				'/api/items',
				{ url: nextUrl },
				{
					auth: {
						username: process.env.AUTH_USERNAME,
						password: process.env.AUTH_PASSWORD,
					},
				},
			);
			this.logger.verbose('Done ✅');
			this.logger.verbose('Pull ids from quickresto...');
			const qr = this.quickresto.extractIdFromQR();
			this.logger.verbose('Done ✅');
			const result: (Processed & Coffee)[] = [];
			const [w, q] = await Promise.all([coffees, qr]);
			await this.prisma.metric.update({
				where: { id },
				data: { nextUrl: w.data.nextUrl },
			});
			for (const coffee of w.data.products) {
				for (const quickresto of q) {
					if (compareStrings(coffee.name, quickresto.name)) {
						result.push({
							...quickresto,
							...coffee,
						});
					}
				}
			}
			return result;
		} catch (err) {
			throw err;
		}
	}
}
