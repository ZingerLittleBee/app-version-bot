import { Telegraf } from 'npm:telegraf@^4.12.2'
import { message } from 'npm:telegraf@^4.12.2/filters'
import { config } from 'https://deno.land/x/dotenv@v3.2.2/mod.ts'
import type { AppInfo, AnalyzeRecord } from './interface.ts'
import { TaskManager } from './task.ts'
import { dbManager } from './db.ts'
import { extractId } from './utils.ts'
import { PageAnalyze } from './PageAnalyze.ts'
import { analyzeRecordFormat } from './format.ts'

export class BotManager {
	private bot: Telegraf
	private taskManager: TaskManager

	constructor() {
		const env = config()
		this.bot = new Telegraf(env.BOT_TOKEN)
		this.taskManager = new TaskManager(
			this.bot.telegram.sendMessage.bind(this.bot.telegram)
		)
		this.listen()
		this.bot.launch()
	}

	listen() {
		this.bot.command('start', ctx => ctx.reply('Welcome!'))
		this.bot.command('help', ctx =>
			ctx.reply(
				'/listen app_url\n\nexample: /listen https://apps.apple.com/us/app/serverbee/id6443553714'
			)
		)

		this.bot.command('listen', async (ctx) => {
			const args = ctx.message.text.split(' ')
			if (args.length > 3) {
				ctx.reply('Invalid command')
				return
			}
			let url = args[1]

			const interval = args[2] ? parseInt(args[2]) : 360

			let appInfo = dbManager.getAppInfoByUrl(url)
			if (appInfo === null) {
				const appId = extractId(url)
                if (appId) {
                    appInfo = {
                        appId: appId,
                        url: url
                    } as AppInfo
                    dbManager.addAppInfo(appInfo)
                } else {
                    ctx.reply(`Extract App Id Error, Please check the url`)
                    return
                }
            }
            const analyze = await PageAnalyze(url, appInfo.appId)

			ctx.reply(analyzeRecordFormat(analyze, 'Listening'))
		})

		this.bot.on(message('text'), async ctx => {
			// Explicit usage
			await ctx.telegram.sendMessage(
				ctx.message.chat.id,
				`Hello ${ctx.state.role}`
			)

			// Using context shortcut
			await ctx.reply(`Hello ${ctx.state.role}`)
		})

		this.bot.on('callback_query', async ctx => {
			// Explicit usage
			await ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

			// Using context shortcut
			await ctx.answerCbQuery()
		})
	}

	sendMsgToChannel(chatId: string | number, msg: string) {
		this.bot.telegram.sendMessage(chatId, msg)
	}

	stop() {
		// // Enable graceful stop
		this.bot.stop('SIGINT')
	}

	kill() {
		this.bot.stop('SIGTERM')
	}
}

export const botManager = new BotManager()
