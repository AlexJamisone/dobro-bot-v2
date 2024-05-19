import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import type { CoffeeInfo, RawCoffeeInfo } from './wrapapi.type';

@Injectable()
export class WrapapiService {
	private readonly logger = new Logger(WrapapiService.name);
	private base = axios.create({
		baseURL: process.env.WRAP_API_LINK,
		params: {
			stateToken: process.env.WRAP_API_STATE_TOKEN,
			wrapAPIKey: process.env.WRAP_API_KEY,
		},
	});

	async getCoffeeInfo(): Promise<CoffeeInfo[]> {
		try {
			const names = await this.getName();
			const promises = names.map((name) => this.getSinglCoffeeInfo(name));
			const result = await Promise.all(promises);
			return result;
		} catch (err) {
			this.logger.error(`Error on call getCoffeeInfo`);
			console.log(err);
		}
	}
	private async getSinglCoffeeInfo(name: string): Promise<CoffeeInfo> {
		try {
			const response = await this.base.get<CoffeeInfo>(
				'/ditails/latest',
				{
					params: {
						name,
					},
					transformResponse: [
						(response: string) => {
							const res: RawCoffeeInfo = JSON.parse(response);
							const regex = /\d+(?=\D*$)/;
							const type = res.data.img.match(regex);
							return {
								success: res.success,
								name: res.data.name,
								price: parseInt(res.data.price),
								img: res.data.img,
								info: res.data.info.map((inf) => ({
									key:
										inf.key
											.replace(/<[^>]+>/g, '')
											.trim()
											.split(':')[0] + ':',
									value: inf.value,
								})),
								description: res.data.description
									.map((value) =>
										value.replace(
											/<!--[^>]+-->\r\n\r\n/,
											'',
										),
									)
									.filter((value) => value.trim() !== '')
									.slice(0, 3),
								type: type[0] === '025' ? 250 : +type[0],
							};
						},
					],
				},
			);
			return response.data;
		} catch (err) {
			if (axios.isAxiosError(err)) {
				this.logger.error(
					`Error on call getSinglCoffeeInfo on ${name}, message: ${err.message}`,
				);
			}
		}
	}

	private async getName(): Promise<string[]> {
		try {
			const response = await this.base.get<{
				success: boolean;
				links: string[];
			}>('/links/latest', {
				transformResponse: [
					(response: string) => {
						const res: {
							success: boolean;
							data: { links: string[] };
						} = JSON.parse(response);
						return {
							success: res.success,
							links: res.data.links.map((link) =>
								link.replace(/.*\//, ''),
							),
						};
					},
				],
			});
			if (response.data.success) {
				return response.data.links;
			} else {
				this.logger.error('Bad call of wrapapi getName func');
				throw new Error('Bad call');
			}
		} catch (err) {
			console.log(err);
		}
	}
}
