import { Module } from '@nestjs/common';
import { QuickrestoService } from './quickresto.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	providers: [QuickrestoService],
	exports: [QuickrestoService],
})
export class QuickrestoModule {}
