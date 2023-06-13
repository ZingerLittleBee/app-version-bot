import { PageAnalyze } from "./PageAnalyze.ts";
import { dbManager } from './db.ts'
import { analyzeRecordFormat } from "./format.ts";
import { Task } from "./interface.ts";
import * as semver from "std/semver/mod.ts";

export class TaskManager {
    // <taskId, intervalId>
    private map: Map<number, number> = new Map()
    private sendMsgToChannel: (chatId: string, msg: string) => void

    constructor(sendMsgToChannel: (chatId: string, msg: string) => void) {
        this.sendMsgToChannel = sendMsgToChannel
        this.runAll()
    }

    addTask(task: Task) {
        const intervalId = setInterval(() => {
            this.run(task)
        }, task.interval * 1000)
        this.map.set(task.id, intervalId)
        dbManager.addTask(task)
    }

    removeTask(id: number) {
        const intervalId = this.map.get(id)
        if (intervalId) {
            clearInterval(intervalId)
            this.map.delete(id)
        }
        dbManager.removeTask(id)
    }

    private runAll() { 
        const tasks = dbManager.listTask()
        tasks.forEach((task, index) => {
            setTimeout(() => {
                const intervalId = setInterval(() => {
                    this.run(task)
                }, task.interval * 1000)
                this.map.set(task.id, intervalId)
            }, index * 5000)
        })
    }

    private async run(task: Task) {
        const url = dbManager.findUrlByAppId(task.appId)
        if (url) { 
            const record = await PageAnalyze(url)
            if (record.version) {
                const oldRecord = dbManager.getAnalyzeRecordByAppId(task.appId)
                if (!oldRecord?.version || semver.gt(record.version, oldRecord.version)) {
                    dbManager.updateAnalyzeRecord(record)
                    this.sendMsgToChannel(task.chatId, analyzeRecordFormat(record))
                }
            }
        }
    }
}
