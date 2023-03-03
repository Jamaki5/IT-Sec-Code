const puppeteer = require("puppeteer");
const {sleep} = require("./sleep");

const readFiles = require("./readFiles").readFiles

const duckduckgooseAutomate = async() =>{
    const files = await readFiles();
    for(let i=136; i<files.length;i++){

        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();

        console.log(files[i])

        await page.goto("https://www.duckduckgoose.ai/demo", {waitUntil: "domcontentloaded"});

        await page.evaluate(()=>{document.querySelector("#w-tabs-0-data-w-tab-2").click()});
    
        await page.waitForSelector('input[id=fileElemVideoFile]');
        const uploadField = await page.$('input[id=fileElemVideoFile]');
        await uploadField.uploadFile(files[i]);

        sleep(100);

        await page.waitForSelector("input[id=emailAddressVideoFile]");
        await page.type("input[id=emailAddressVideoFile]","<E-Mail-Adresse>");

        sleep(500);

        const button = await page.waitForSelector("#analyzeButtonVideoFile > a");
        await button.click();

        await page.waitForSelector("#resultContainerVideoFile > div > div", {visible: true, timeout:0});

        browser.close();
    }
}

duckduckgooseAutomate();