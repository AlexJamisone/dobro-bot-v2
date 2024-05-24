import { Injectable, LoggerService as Logger } from '@nestjs/common';
import { create } from 'ansi-colors';

@Injectable()
export class LoggerService implements Logger {
	constructor() {
		console.log('init logger');
	}

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
		const logMessage = `[${this.getDate()}] - LOG: [${ctx}] ${message} ${this.measurePerformance()}`;
		this.logs.push(logMessage);
		console.log(this.colors.green.bold(logMessage));
	}

	error(message: string, trace: string) {
		const logMessage = `ERROR: ${message} - TRACE: ${trace}`;
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

	verbose(message: string) {
		const logMessage = `VERBOSE: ${message}`;
		this.logs.push(logMessage);
		console.log(this.colors.cyan(logMessage));
	}

	getLogs(): string {
		console.log(this.logs); // тут при вызове пусто
		return this.logs.join('\n');
	}
}
