import { Controller, Get, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from 'src/auth.guards';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
	constructor(private readonly servise: ApiService) {}

	@Get()
	@UseGuards(BasicAuthGuard)
	async getCoffee() {
		return await this.servise.getCoffee();
	}
}
