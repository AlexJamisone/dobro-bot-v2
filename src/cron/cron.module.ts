import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuickrestoModule } from 'src/quickresto/quickresto.module';

@Module({
	imports: [ScheduleModule.forRoot(), PrismaModule, QuickrestoModule],
	providers: [CronService],
	exports: [CronService],
})
export class CronModule {}
