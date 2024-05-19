import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WrapapiModule } from 'src/wrapapi/wrapapi.module';
import { QuickrestoModule } from 'src/quickresto/quickresto.module';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		PrismaModule,
		WrapapiModule,
		QuickrestoModule,
	],
	providers: [CronService],
})
export class CronModule {}
