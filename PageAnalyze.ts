import puppeteer, {devices} from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

type PageType = {
    url: string,
}

const testPage = 'https://apps.apple.com/us/app/serverbee/id6443553714'

export async function PageAnalyze() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.emulate(devices['Galaxy S8']);

    await page.goto(testPage, {
        waitUntil: "networkidle0",
        timeout: 0
    });

    let name = ''
    const nameElements = await page.$x("/html/body/div[3]/main/div[2]/section[1]/div/div[2]/header/h1");
    if (nameElements?.isNotEmpty) {
        name = await page.evaluate((el: any) => el.textContent, nameElements[0]);
    }

    const ageElements = await page.$x("/html/body/div[3]/main/div[2]/section[1]/div/div[2]/header/h1/span");
    if (ageElements?.isNotEmpty) {
        const age = await page.evaluate((el: any) => el.textContent, ageElements[0]);
        name = name.replace(age, '').trim()
    }
    console.log(`name: ${name}`);

    let version = ''
    const versionElements = await page.$x("/html/body/div[3]/main/div[2]/section[4]/div[2]/div[1]/div/p");
    if (versionElements?.isNotEmpty) {
        version = await page.evaluate((el: any) => el.textContent, versionElements[versionElements.length -  1]);
    }
    console.log(`version: ${version}`);

    let newDesc = []
    const newDescElements = await page.$x("/html/body/div[3]/main/div[2]/section[4]/div[2]/div[2]/div/div");
    for (let element of newDescElements) {
        let text = await page.evaluate((el: any) => el.textContent, element);
        newDesc.push(text)
    }
    console.log(`desc: ${newDesc.join('\n')}`);

    await browser.close();
}
