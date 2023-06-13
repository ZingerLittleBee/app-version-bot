import { AnalyzeRecord } from "./interface.ts";

export const analyzeRecordFormat = (record: AnalyzeRecord, event?: string) => {
    return `
${event ? event : 'New Version!'}
${record.name}
ID: ${record.appId}
Version: ${record.version}
Desc: ${record.desc}`
}