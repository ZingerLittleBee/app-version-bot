import {AnalyzeRecord, AppInfo, DBManager} from "./db.ts";

const dbManager = new DBManager()

dbManager.addAppInfo({
    appId: '123',
    url: 'test url',
    desc: 'test'
} as AppInfo)

dbManager.addAnalyzeRecord({
    name: 'test name',
    version: '1.0.0',
    desc: 'test desc',
    appId: '123'
} as AnalyzeRecord)

console.log(dbManager.listAppInfo())
console.log(dbManager.getAnalyzeRecordByAppId('123'))
dbManager.updateAnalyzeRecord({
    name: 'test name 2',
    version: '2.0.0',
    desc: 'test desc 2',
    appId: '123'
} as AnalyzeRecord)
console.log(dbManager.getAnalyzeRecordByAppId('123'))
