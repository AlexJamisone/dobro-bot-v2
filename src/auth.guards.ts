import {
	UnauthorizedException,
	ExecutionContext,
	CanActivate,
	Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthGuard implements CanActivate {
	private readonly username = process.env.AUTH_USERNAME;
	private readonly password = process.env.AUTH_PASSWORD;
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const authHeader = request.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Basic ')) {
			throw new UnauthorizedException('Auth header not found or invalid');
		}
		const base64Credentials = authHeader.split(' ')[1];
		const credentials = Buffer.from(base64Credentials, 'base64').toString(
			'utf8',
		);
		const [username, password] = credentials.split(':');
		if (username === this.username && password === this.password) {
			return true;
		} else {
			throw new UnauthorizedException('Invalid username or password');
		}
	}
}
