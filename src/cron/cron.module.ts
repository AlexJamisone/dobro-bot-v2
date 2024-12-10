import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuickrestoModule } from 'src/quickresto/quickresto.module';
import { ApiModule } from 'src/api/api.module';

@Module({
	imports: [ScheduleModule.forRoot(), PrismaModule, QuickrestoModule, ApiModule],
	providers: [CronService],
	exports: [CronService],
})
export class CronModule {}
