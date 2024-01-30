import { Injectable } from '@nestjs/common';
import response from 'src/constant/response';
import { QuickrestoService } from 'src/quickresto/quickresto.service';
import { Context } from 'telegraf';

@Injectable()
export class BotService {
    constructor(qrService: QuickrestoService) {}
    async start(ctx: Context) {
       return ctx.reply(response.welcome())
    }

}
