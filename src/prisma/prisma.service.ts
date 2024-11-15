import {
	Injectable,
	Logger,
	OnModuleInit,
	OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Processed } from 'src/quickresto/quickresto.types';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(PrismaService.name);
	async onModuleInit() {
		await this.$connect();
		this.logger.log('Connect to DB');
	}
	async onModuleDestroy() {
		await this.$disconnect();
		this.logger.log('Disconnect from DB');
	}
	async getDbCoffee(): Promise<{ qid: number; price: number }[]> {
		return await this.coffee.findMany({
			where: {
				NOT: {
					qid: null,
					Iid: null,
				},
			},
			select: {
				qid: true,
				price: true,
			},
		});
	}
	async upsertCoffeesInDb({
		coffees,
	}: {
		coffees: (Coffee & Processed)[];
	}): Promise<boolean> {
		const promises = coffees.map((coffee) => {
			return this.coffee.upsert({
				where: {
					name: coffee.name,
				},
				update: {
					price: coffee.price,
				},
				create: {
					price: coffee.price,
					image: coffee.image,
					name: coffee.name,
					description: coffee.description,
					Iid: coffee.Iid,
					qid: coffee.qid,
					short: coffee.short,
					fields: coffee.fields,
					acidity: coffee.acidity,
					density: coffee.density,
				},
			});
		});
		const upserting = await this.$transaction(promises);
		if (!upserting) {
			return false;
		}
		return true;
	}
	async inc() {
		try {
			const metric = await this.metric.findFirst();
			if (!metric) {
				const m = await this.metric.create({
					data: {
						count: 0,
					},
				});
				await this.metric.update({
					where: { id: m.id },
					data: {
						count: {
							increment: 1,
						},
					},
				});
				return;
			}
			await this.metric.update({
				where: {
					id: metric.id,
				},
				data: {
					count: {
						increment: 1,
					},
				},
			});
		} catch (err) {
			console.log(err);
		}
	}
	async getMetric(): Promise<{ count: number; nextUrl: string }> {
		try {
			const { nextUrl, count } = await this.metric.findFirst({
				select: { count: true, nextUrl: true },
			});
			return {
				count,
				nextUrl,
			};
		} catch (err) {
			console.log(err);
		}
	}
	async clearMetric(): Promise<void> {
		try {
			const id = await this.metric.findFirst().then((res) => res.id);
			await this.metric.update({
				where: { id },
				data: {
					count: 0,
				},
			});
		} catch (err) {
			console.log(err);
			throw new Error('Error clear metric');
		}
	}
}
