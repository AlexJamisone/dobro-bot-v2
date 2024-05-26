import { Injectable, LoggerService as Logger } from '@nestjs/common';
import { create } from 'ansi-colors';

@Injectable()
export class LoggerService implements Logger {
	private logs: string[] = [];
	private colors = create();

	private getDate(): string {
		const now = new Date();
		const date = now.toLocaleString('ru-Ru', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		});
		const time = now.toLocaleString('ru-Ru', {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
		});
		const formattedDate = `${date} ${time}`;
		return this.colors.yellow(formattedDate);
	}
	private measurePerformance(): string {
		const start = process.hrtime();
		for (let i = 0; i < 1e6; i++) {
			Math.sqrt(i);
		}
		const end = process.hrtime(start);
		let timeString = '';
		if (end[0] !== 0) {
			timeString += `${end[0]}s `;
		}

		if (end[1] !== 0) {
			const milliseconds = end[1] / 1e6;
			if (milliseconds >= 1) {
				timeString += `${milliseconds.toFixed(0)}ms`;
			} else {
				const microseconds = end[1] / 1e3;
				timeString += `${microseconds.toFixed(0)}µs`;
			}
		}

		return `${this.colors.cyan(`+${timeString.trim() || '0s'}`)}`;
	}

	log(message: string, ctx?: string) {
		const context = ctx ? `[${ctx}]` : '';
		const logMessage = `[${this.getDate()}] - LOG: ${context} ${message} ${this.measurePerformance()}`;
		this.logs.push(logMessage);
		console.log(this.colors.green.bold(logMessage));
	}

	error(message: string, t: string) {
		const trace = t ? `- TRACE: ${t}` : '';
		const logMessage = `[${this.getDate()}] - ERROR: ${message} ${trace}  ${this.measurePerformance()}`;
		this.logs.push(logMessage);
		console.error(this.colors.red(logMessage));
	}

	warn(message: string) {
		const logMessage = `WARN: ${message}`;
		this.logs.push(logMessage);
		console.warn(this.colors.yellow(logMessage));
	}

	debug(message: string) {
		const logMessage = `DEBUG: ${message}`;
		this.logs.push(logMessage);
		console.debug(this.colors.blue(logMessage));
	}

	verbose(message: string, ctx?: string) {
		const context = ctx ? `[${ctx}]` : '';
		const logMessage = `[${this.getDate()}] - INFO: ${context} ${message} ${this.measurePerformance()}`;
		this.logs.push(logMessage);
		console.log(this.colors.cyan(logMessage));
	}
	clear(): void {
		this.logs = [];
	}

	getLogs(): string {
		const lastLogs = this.logs.slice(-20);
		this.logs = lastLogs;
		return lastLogs.join('\n').replace(/\[\d+m/g, '');
	}
}
