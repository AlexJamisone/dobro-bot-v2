import {
	Injectable,
	Logger,
	OnModuleInit,
	OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Processed } from 'src/quickresto/quickresto.types';
import { CoffeeInfo } from 'src/wrapapi/wrapapi.type';

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
		coffees: (CoffeeInfo & Processed)[];
	}): Promise<boolean> {
		const promises = coffees.map((coffee, idx) => {
			this.logger.verbose(`Upsert on ${idx} index`);
			return this.coffee.upsert({
				where: {
					img: coffee.img,
				},
				update: {
					price: coffee.price,
				},
				create: {
					price: coffee.price,
					img: coffee.img,
					name: coffee.name,
					type: coffee.type,
					info: {
						createMany: {
							data: coffee.info.map((i) => ({
								key: i.key,
								value: i.value,
							})),
						},
					},
					description: coffee.description,
					Iid: coffee.Iid,
					qid: coffee.qid,
				},
			});
		});
		const upserting = await this.$transaction(promises);
		if (!upserting) {
			return false;
		}
		return true;
	}
}
