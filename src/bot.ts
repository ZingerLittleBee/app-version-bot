import { Telegraf } from 'npm:telegraf@^4.12.2';
import { message } from 'npm:telegraf@^4.12.2/filters';
import { config } from "https://deno.land/x/dotenv/mod.ts";
import type { AppInfo, AnalyzeRecord } from './interface.ts'

export class BotManager {
    private bot: Telegraf;

    constructor() {
        const env = config();
        this.bot = new Telegraf(env.BOT_TOKEN);
        this.listen();
        this.bot.launch();
    }

    listen() {
        this.bot.command('start', (ctx) => ctx.reply('Welcome!'));
        this.bot.command('help', (ctx) => ctx.reply('/listen app_url\n\nexample: /listen https://apps.apple.com/us/app/serverbee/id6443553714'));

        this.bot.on(message('text'), async (ctx) => {
            // Explicit usage
            await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);

            // Using context shortcut
            await ctx.reply(`Hello ${ctx.state.role}`);
        });

        this.bot.on('callback_query', async (ctx) => {
            // Explicit usage
            await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

            // Using context shortcut
            await ctx.answerCbQuery();
        });
    }

    sendMsgToChannel(chatId: string | number, msg: string) {
        this.bot.telegram.sendMessage(chatId, msg);
    }

    stop() {
        // // Enable graceful stop
        this.bot.stop('SIGINT');
    }

    kill() {
        this.bot.stop('SIGTERM');
    }
}
