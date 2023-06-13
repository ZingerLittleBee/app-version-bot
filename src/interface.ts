interface Base {
    id: number;
    createTime: Date;
    updateTime: Date;
}

interface AppInfo extends Base {
    appId: string;
    url: string;
    desc: string;
}

interface AnalyzeRecord extends Base {
    name: string;
    version: string;
    desc?: string;
    appId: string;
    format: () => string;
}

interface Task extends Base {
    appId: string;
    interval: number;
    chatId: string;
}

export type { AppInfo, AnalyzeRecord, Task }