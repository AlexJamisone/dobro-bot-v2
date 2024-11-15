import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApiService {
	constructor(private readonly db: PrismaService) {}

	async getCoffee() {
		try {
			return await this.db.coffee.findMany();
		} catch (err) {
			throw err;
		}
	}
}
