import { Module } from '@nestjs/common';
import { WrapapiService } from './wrapapi.service';

@Module({
	providers: [WrapapiService],
	exports: [WrapapiService],
})
export class WrapapiModule {}
