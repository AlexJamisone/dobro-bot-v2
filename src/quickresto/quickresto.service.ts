import { Injectable } from '@nestjs/common';
import axios from 'axios';
type User = {
	name?: string;
	bonuses?: number;
	noCustomer: boolean;
	error: string | null;
};

@Injectable()
export class QuickrestoService {
	private qr = axios.create({
		baseURL: process.env.BASE_PATH,
		headers: {
			'Content-Type': 'application/json',
		},
		auth: {
			username: process.env.LOGIN,
			password: process.env.PASSWORD,
		},
	});
	async getUser(phone: string): Promise<User> {
		try {
			const user = await this.qr.post('bonuses/filterCustomers', {
				search: phone,
			});
			if (user.data.customers.length === 0) {
				return {
					noCustomer: true,
					error: null,
				};
			} else {
				const readUser = await this.qr.get('api/read', {
					params: {
						moduleName: 'crm.customers',
						objectId: user.data.customers[0].id,
					},
				});
				const bonuses =
					await readUser.data.accounts[0].accountBalance.ledger;
				const name: string =
					(await user.data.customers[0].firstName) ||
					user.data.customers[0].lastName;
				return {
					bonuses,
					name,
					noCustomer: false,
					error: null,
				};
			}
		} catch (err) {
			console.log('error in getUser qr:', err);
			return {
				noCustomer: false,
				error: 'Ошибка, уже разбираемся с этим',
			};
		}
	}
}
