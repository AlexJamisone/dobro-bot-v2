import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { compareStrings } from 'src/constant/helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuickrestoService } from 'src/quickresto/quickresto.service';
import { Processed } from 'src/quickresto/quickresto.types';
import { WrapapiService } from 'src/wrapapi/wrapapi.service';
import { CoffeeInfo } from 'src/wrapapi/wrapapi.type';

@Injectable()
export class CronService {
	constructor(
		private readonly wrapapi: WrapapiService,
		private readonly quickresto: QuickrestoService,
		private readonly prisma: PrismaService,
	) {}
	private readonly logger = new Logger(CronService.name);

	@Cron('45 * * * * *')
	async handlCron() {
		this.logger.verbose('Start Cron task');
		const coffees = await this.merge();
		await this.prisma.upsertCoffeesInDb({ coffees });
		await this.quickresto.updateMinimalPrice();
		this.logger.verbose('End cron Task');
	}
	private async merge() {
		const wrap = this.wrapapi.getCoffeeInfo();
		const qr = this.quickresto.extractIdFromQR();
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
