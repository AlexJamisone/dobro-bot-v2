import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { QuickrestoModule } from './quickresto/quickresto.module';
import {ConfigModule} from '@nestjs/config'
@Module({
  imports: [ConfigModule.forRoot(), BotModule, QuickrestoModule],
})
export class AppModule {}
