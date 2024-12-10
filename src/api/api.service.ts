import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { Root } from './api.tasty.intrerface';

@Injectable()
export class ApiService {
	constructor(private readonly db: PrismaService) {}

	private tasty_coffee = axios.create({
		baseURL: 'https://shop.tastycoffee.ru/api/v2',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	private cookie: string = '';

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
	private async auth() {
		try {
			if (this.cookie) {
				return;
			}
			const response = await this.tasty_coffee.post<{ token: string }>(
				'/login',
				{
					email: process.env.TASTY_EMAIL,
					password: process.env.TASTY_PASSWORD,
				},
			);
			return response.data.token;
		} catch (err) {
			console.log(err);
		}
	}
	async getCoffeeLink(): Promise<string[]> {
		try {
			const token = await this.auth();
			const response = await this.tasty_coffee.post<Root>(
				'/cart',
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			return response.data.data.items.map(
				(i) => `https://shop.tastycoffee.ru${i.product.slug}`,
			);
		} catch (err) {
			console.log(err);
		}
	}
}
