import {AnalyzeRecord, AppInfo, DBManager} from "./src/db.ts";
import {Task} from "./src/interface.ts";
import {assertExists, assertEquals} from "std/testing/asserts.ts";

const testFile = 'test.db'

// clear test file
try {
    await Deno.stat(testFile);
    await Deno.remove(testFile);
} catch (_) {}

const dbManager = new DBManager('test.db')

const testAppId = '123'
const testChatId = 'testChatId'

dbManager.addAppInfo({
    appId: testAppId,
    url: 'test url',
    desc: 'test desc'
} as AppInfo)

dbManager.addAnalyzeRecord({
    name: 'test name',
    version: '1.0.0',
    desc: 'test desc',
    appId: testAppId
} as AnalyzeRecord)

Deno.test('test add app info', () => {
    assertEquals(dbManager.listAppInfo().length, 1)
})

Deno.test('test get app info by id', () => {
    assertExists(dbManager.getAppInfoById(testAppId))
})

Deno.test('test update analyze record', () => {
    dbManager.updateAnalyzeRecord({
        name: 'test name 2',
        version: '2.0.0',
        desc: 'test desc 2',
        appId: testAppId
    } as AnalyzeRecord)

    assertEquals(dbManager.getAnalyzeRecordByAppId(testAppId)?.name, 'test name 2')
})


dbManager.addTask({
    appId: testAppId,
    interval: 1000,
    chatId: testChatId
} as Task)

Deno.test('test list task', () => {
    assertEquals(dbManager.listTask().length, 1)
})

Deno.test('test get task by chat id', () => {
    assertExists(dbManager.getTaskByChatId(testChatId))
})
