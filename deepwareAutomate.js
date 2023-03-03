// Package Imports
const puppeteer = require("puppeteer");
const fs = require("fs");
const { sleep } = require("./sleep");
const { wait } = require("./wait");

// Local Imports
const readFiles = require("./readFiles").readFiles;

const deepwareAutomate = async (file, page) => {
  await page.goto("https://scanner.deepware.ai/");

  await wait(page);

  const uploadField = await page.$('input[type="file"]');
  if (!uploadField) {
    console.log("no field found!");
    return;
  }

  await uploadField.uploadFile(file);

  await wait(page);

  await page.waitForSelector(
    'div[class="col-xs-6 col-md-10 m-y-auto statusText"]',
    { visible: true }
  );

  const textHandler = await page.$(
    'div[class="col-xs-6 col-md-10 m-y-auto statusText"]'
  );

  const overallResult = await (
    await textHandler.getProperty("innerText")
  ).jsonValue();

  const percentage = await page.$eval(
    'div[class="col-sm-12 col-md-4"]',
    (el) => {
      const array = el.lastChild.childNodes;
      const text = [];
      for (a of array) {
        text.push(a.innerText);
      }
      return text;
    }
  );

  const RegEx = new RegExp(/(.*):\n(.*)\((.*)\)/);
  const jsonPercentage = [];

  for (p of percentage) {
    const matches = p.match(RegEx);
    jsonPercentage.push({
      model: matches[1],
      detected: matches[2],
      rate: matches[3],
    });
  }
  const result = {
    name: file,
    result: overallResult,
    models: jsonPercentage,
  };
  await sleep(2000);

  return result;
};

const main = async () => {
  const files = await readFiles();

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const jsonToSave = [];

  for (file of files) {
    console.log("Die Datei " + file + " wird hochgeladen...");

    try {
      jsonToSave.push(await deepwareAutomate(file, page));
      console.log(
        "Die Datei " + file + " wurde erfolgreich hochgeladen und verarbeitet!"
      );
    } catch (err) {
      console.log("Folgender Error ist aufgetreten: \n" + err);
    }
  }

  console.log("Alle Dateien wurden verarbeitet!");

  fs.writeFileSync(
    `deepware_save_${new Date().toISOString()}.json`,
    JSON.stringify(jsonToSave, null, 2)
  );

  await browser.close();
};

main();
