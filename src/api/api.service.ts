import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApiService {
	constructor(private readonly db: PrismaService) {}

	async getCoffee() {
		try {
			return await this.db.coffee.findMany({
				select: {
					id: true,
					name: true,
					image: true,
					price: true,
					short: true,
					fields: true,
					acidity: true,
					density: true,
					description: true,
				},
			});
		} catch (err) {
			throw err;
		}
	}
}
