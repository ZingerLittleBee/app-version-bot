import { Telegraf } from 'npm:telegraf@^4.12.2';
import { message } from 'npm:telegraf@^4.12.2/filters';
import { config } from "https://deno.land/x/dotenv/mod.ts";
import {once} from "https://deno.land/std@0.177.0/node/_utils.ts";
import { PageAnalyze } from './PageAnalyze.ts'

await PageAnalyze()

//
// const env = config();
//
// console.log(env.DB_HOST); // 输出：localhost
// console.log(env.DB_USER); // 输出：root
// console.log(env.DB_PASS); // 输出：s1mpl3
//
// console.log(env.URL.split(',').map(url => url.trim())); // 输出：s1mpl3
//
// const bot = new Telegraf(env.BOT_TOKEN);
//
// bot.command('quit', async (ctx) => {
//     // Explicit usage
//     await ctx.telegram.leaveChat(ctx.message.chat.id);
//
//     // Using context shortcut
//     await ctx.leaveChat();
// });
//
// bot.on(message('text'), async (ctx) => {
//     // Explicit usage
//     await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);
//
//     // Using context shortcut
//     await ctx.reply(`Hello ${ctx.state.role}`);
// });
//
// bot.on('callback_query', async (ctx) => {
//     // Explicit usage
//     await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
//
//     // Using context shortcut
//     await ctx.answerCbQuery();
// });
//
// bot.on('inline_query', async (ctx) => {
//     const result = [];
//     // Explicit usage
//     await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);
//
//     // Using context shortcut
//     await ctx.answerInlineQuery(result);
// });
//
// bot.launch();
//
// // Enable graceful stop
// once('SIGINT', () => bot.stop('SIGINT'));
// once('SIGTERM', () => bot.stop('SIGTERM'));
