import { Injectable, Logger } from '@nestjs/common';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { Metric } from './metric.types';

@Injectable()
export class MetricService {
	private readonly logger = new Logger(MetricService.name);
	private filePath: string = join(process.cwd(), 'metric.json');
	private getMetric(): Metric {
		if (!existsSync(this.filePath)) {
			const data: Metric = { count: 0 };
			writeFileSync(this.filePath, JSON.stringify(data, null, 2));
			this.logger.warn('File with metric was create, couse not found 💫');
			return data;
		} else {
			this.logger.log('File exist! ♻️');
			const data: Metric = JSON.parse(
				readFileSync(this.filePath, 'utf8'),
			);
			return data;
		}
	}
	inc(): void {
		const data: Metric = this.getMetric();
		data.count++;
		writeFileSync(this.filePath, JSON.stringify(data, null, 2));
	}
	extract(): number {
		return this.getMetric().count;
	}
	clear(): void {
		const data: Metric = this.getMetric();
		data.count = 0;
		writeFileSync(this.filePath, JSON.stringify(data, null, 2));
	}
}
