import { Injectable, Logger } from '@nestjs/common';
import type { Processed, ResponseQType } from './quickresto.types.ts';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
type User = {
	name?: string;
	bonuses?: number;
	noCustomer: boolean;
	error: string | null;
};

@Injectable()
export class QuickrestoService {
	constructor(private readonly prisma: PrismaService) {
		this.init();
	}
	private readonly logger = new Logger(QuickrestoService.name);
	private init() {
		this.rowQr.interceptors.request.use(
			async (config) => {
				if (!config.headers['Cookie']) {
					const cookies = await this.auth();
					if (cookies) {
						config.headers['Cookie'] = cookies.join('; ');
					}
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			},
		);
	}

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

	private rowQr = axios.create({
		baseURL: process.env.ROW_PATH,
		headers: {
			'Content-Type': 'application/json',
		},
	});
	async extractIdFromQR(): Promise<Processed[]> {
		try {
			const dishProimise = this.rowQr.get<ResponseQType>(
				'/data/warehouse.nomenclature.dish/select',
				{
					params: {
						parentContextId: 836,
						parentContextClassName:
							'ru.edgex.quickresto.modules.warehouse.nomenclature.dish.DishCategory',
					},
				},
			);
			const ingridientPromise = this.rowQr.get<ResponseQType>(
				'/data/warehouse.nomenclature.singleproduct/select',
				{
					params: {
						parentContextId: 835,
						parentContextClassName:
							'ru.edgex.quickresto.modules.warehouse.nomenclature.singleproduct.SingleCategory',
					},
				},
			);
			const [di, ing] = await Promise.all([
				dishProimise,
				ingridientPromise,
			]);
			const concat: Processed[] = [];
			for (const dish of di.data.ds) {
				for (const singl of ing.data.ds) {
					if (
						singl.object.name
							.toLowerCase()
							.includes(dish.object.name.toLowerCase())
					) {
						concat.push({
							name: singl.object.name,
							Iid: singl.object.id,
							qid: dish.object.id,
						});
					}
				}
			}
			return concat;
		} catch (err) {
			console.log(err);
		}
	}
	async updateMinimalPrice() {
		try {
			const coffees = await this.prisma.getDbCoffee();
			const promises = coffees.map(async (item) => {
				const response = await this.qr.post(
					'/api/update',
					{
						id: item.qid,
						minimalPrice: item.price,
					},
					{
						params: {
							className:
								'ru.edgex.quickresto.modules.warehouse.nomenclature.dish.Dish',
							moduleName: 'warehouse.nomenclature.dish',
						},
					},
				);
				if (response.status !== 200) {
					return false;
				}
				return true;
			});
			const result = await Promise.all(promises);
			if (result.some((value) => value === false)) {
				this.logger.warn('Some value not update');
			} else {
				this.logger.verbose('All minimalPrice update');
			}
		} catch (err) {
			console.log(err);
		}
	}

	private async auth(): Promise<string[]> {
		try {
			const formData = new URLSearchParams();
			formData.append('j_username', process.env.Q_API_NAME_RAW);
			formData.append('j_password', process.env.Q_API_PASSWORD_RAW);
			formData.append('j_rememberme', 'true');
			const res = await axios.post(
				`${process.env.ROW_PATH}/j_spring_security_check`,
				formData,
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				},
			);
			return res.headers['set-cookie'];
		} catch (error) {
			console.log('qresto.service.auth: ', error);
			throw error;
		}
	}
	async getUser(phone: string): Promise<User> {
		try {
			const user = await this.qr.post('/bonuses/filterCustomers', {
				search: phone,
			});
			if (user.data.customers.length === 0) {
				return {
					noCustomer: true,
					error: null,
				};
			} else {
				const readUser = await this.qr.get('/api/read', {
					params: {
						moduleName: 'crm.customer',
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
