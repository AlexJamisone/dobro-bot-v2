import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	providers: [ApiService],
	controllers: [ApiController],
	exports: [ApiService],
})
export class ApiModule {}
