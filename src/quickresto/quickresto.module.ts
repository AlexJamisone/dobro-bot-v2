import { Module } from '@nestjs/common';
import { QuickrestoService } from './quickresto.service';

@Module({
  providers: [QuickrestoService]
})
export class QuickrestoModule {}
