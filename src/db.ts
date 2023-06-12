import { DB } from "https://deno.land/x/sqlite/mod.ts";
import type {AppInfo, AnalyzeRecord, Task} from './interface.ts'

class DBManager {
    private db: DB;

    // dbFile for test
    constructor(dbFile?: string) {
        this.db = this.open(dbFile);
    }

    open(dbFile?: string): DB {
        const db = new DB(dbFile ?? "app-version.db");
        // Open a database
        db.execute(`
CREATE TABLE IF NOT EXISTS app_info
(
    id          INTEGER primary key autoincrement,
    app_id      TEXT not null unique,
    url         TEXT not null,
    desc        TEXT,
    create_time INTEGER default CURRENT_TIMESTAMP,
    update_time integer default CURRENT_TIMESTAMP
);
    `);

        // Open a database
        db.execute(`
CREATE TABLE IF NOT EXISTS analyze_record
(
    id          integer primary key autoincrement,
    name        TEXT not null,
    version     TEXT not null,
    desc        TEXT,
    create_time integer default CURRENT_TIMESTAMP,
    update_time integer default CURRENT_TIMESTAMP,
    app_id      TEXT
        constraint analyze_record_app_info_app_id_fk
            references app_info (app_id)
            on update cascade on delete cascade
)
    `);

        db.execute(`
CREATE TABLE IF NOT EXISTS task
(
    id          integer primary key autoincrement,
    chatId      TEXT not null,
    interval    integer default 360,
    create_time integer default CURRENT_TIMESTAMP,
    update_time integer default CURRENT_TIMESTAMP,
    app_id      TEXT not null
        constraint task_app_info_app_id_fk
            references app_info (app_id)
            on update cascade on delete cascade
)
        `)

        return db;
    }

    getAppInfoById(appId: string): AppInfo | null {
        const rows = this.db.query("SELECT * FROM app_info WHERE app_id = ?", [appId]);
        if (rows.length > 0) {
            const [ id, app_id, desc, create_time, update_time ] = rows[0] as any;
            return {
                id,
                appId: app_id,
                desc,
                createTime: new Date(create_time),
                updateTime: new Date(update_time)
            } as AppInfo
        }
        return null
    }

    listAppInfo(): AppInfo[] {
        const rows = this.db.query("SELECT * FROM app_info");
        const result = []
        for (let row of rows) {
            const [ id, app_id, desc, create_time, update_time ] = row as any;
            result.push({
                id,
                appId: app_id,
                desc,
                createTime: new Date(create_time),
                updateTime: new Date(update_time)
            } as AppInfo)
        }
        return result
    }

    addAppInfo(appInfo: AppInfo) {
        this.db.query("INSERT INTO app_info (app_id, url, desc) VALUES (?, ?, ?)", [
            appInfo.appId, appInfo.url , appInfo.desc
        ]);
    }

    removeAppInfo(appId: string) {
        this.db.query("DELETE FROM app_info WHERE app_id = ?", [appId]);
    }

    getAnalyzeRecordByAppId(appID: string) {
        const rows = this.db.query("SELECT * FROM analyze_record WHERE app_id = ?", [appID]);
        if (rows.length > 0) {
            const [ id, name, version, desc, create_time, update_time ] = rows[0] as any;
            return {
                id,
                name: name,
                version,
                desc,
                createTime: new Date(create_time),
                updateTime: new Date(update_time)
            } as AnalyzeRecord
        }
    }

    addAnalyzeRecord(record: AnalyzeRecord) {
        this.db.query("INSERT INTO analyze_record (name, version, desc, app_id) VALUES (?, ?, ?, ?)", [
            record.name, record.version, record.desc, record.appId
        ]);
    }

    updateAnalyzeRecord(record: AnalyzeRecord) {
        const oldRecord = this.getAnalyzeRecordByAppId(record.appId)
        let newRecord = record
        if (oldRecord) {
            // merge oldRecord with newRecord
            newRecord = {
                ...oldRecord,
                ...record
            }
        }

        this.db.query("UPDATE analyze_record SET name = ?, version = ?, desc = ?, update_time = ? WHERE app_id = ?", [
            newRecord.name, newRecord.version, newRecord.desc, Date.now(), newRecord.appId
        ]);
    }

    removeAnalyzeRecord(appId: string) {
        this.db.query("DELETE FROM analyze_record WHERE app_id = ?", [appId]);
    }

    listTask(): Task[] {
        const rows = this.db.query("SELECT * FROM task");
        const result = []
        for (let row of rows) {
            const [ id, chatId, interval, create_time, update_time, app_id ] = row as any;
            result.push({
                id,
                chatId,
                interval,
                createTime: new Date(create_time),
                updateTime: new Date(update_time),
                appId: app_id
            } as Task)
        }
        return result
    }

    getTaskByChatId(chatId: string): Task[] {
        const rows = this.db.query("SELECT * FROM task WHERE chatId = ?", [chatId]);
        const result = []
        for (let row of rows) {
            const [ id, chatId, interval, create_time, update_time, app_id ] = row as any;
            result.push({
                id,
                chatId,
                interval,
                createTime: new Date(create_time),
                updateTime: new Date(update_time),
                appId: app_id
            } as Task)
        }
        return result
    }

    addTask(task: Task) {
        this.db.query("INSERT INTO task (chatId, interval, app_id) VALUES (?, ?, ?)", [
            task.chatId, task.interval, task.appId
        ]);
    }


    removeTask(id: number) {
        this.db.query("DELETE FROM task WHERE id = ?", [id]);
    }

    removeTaskByChatId(chatId: string) {
        this.db.query("DELETE FROM task WHERE chatId = ?", [chatId]);
    }

    close() {
        this.db.close();
    }
}

export { DBManager }
export type { AppInfo, AnalyzeRecord }
