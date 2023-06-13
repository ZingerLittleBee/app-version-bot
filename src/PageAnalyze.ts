import puppeteer, {devices} from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import type { AnalyzeRecord } from './interface.ts'

export async function PageAnalyze(url: string, appId: string): Promise<AnalyzeRecord> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.emulate(devices['Galaxy S8']);

    await page.goto(url, {
        waitUntil: "networkidle0",
        timeout: 0
    });

    let name = ''
    const nameElements = await page.$x("/html/body/div[3]/main/div[2]/section[1]/div/div[2]/header/h1");
    if (nameElements?.length > 0) {
        name = await page.evaluate((el: any) => el.textContent, nameElements[0]);
    }

    const ageElements = await page.$x("/html/body/div[3]/main/div[2]/section[1]/div/div[2]/header/h1/span");
    if (ageElements?.length > 0) {
        const age = await page.evaluate((el: any) => el.textContent, ageElements[0]);
        name = name.replace(age, '').trim()
    }

    let version = ''
    const versionElements = await page.$x("/html/body/div[3]/main/div[2]/section[4]/div[2]/div[1]/div/p");
    if (versionElements?.length > 0) {
        version = await page.evaluate((el: any) => el.textContent, versionElements[versionElements.length -  1]);
    }

    let newDesc = []
    const newDescElements = await page.$x("/html/body/div[3]/main/div[2]/section[4]/div[2]/div[2]/div/div");
    for (let element of newDescElements) {
        let text = await page.evaluate((el: any) => el.textContent, element);
        newDesc.push(text)
    }

    await browser.close();

    return {
        name,
        version,
        appId: appId,
        desc: newDesc.join('\n'),
    } as AnalyzeRecord
}
