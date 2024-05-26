import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WrapapiModule } from 'src/wrapapi/wrapapi.module';
import { QuickrestoModule } from 'src/quickresto/quickresto.module';
import { MetricModule } from 'src/metric/metric.module';

@Module({
	imports: [
		ScheduleModule.forRoot(),
		PrismaModule,
		WrapapiModule,
		QuickrestoModule,
		MetricModule,
	],
	providers: [CronService],
	exports: [CronService],
})
export class CronModule {}
