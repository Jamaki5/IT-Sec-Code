// Package Imports
require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");
const { sleep } = require("./sleep");
const { wait } = require("./wait");

// Local Imports
const readFiles = require("./readFiles").readFiles;

const bioId = async (file, page) => {
  const uploadField = await page.$("input#select-video");
  if (!uploadField) {
    console.log("no field found!");
    return;
  }

  await uploadField.uploadFile(file);

  await page.click("#execute");

  await wait(page);

  await page.waitForSelector("#result-view > div > h4", { visible: true });

  console.log("waiting for result...")
  await sleep(10000)

  const textHandler = await page.$("#result-view > div > h4");

  const overallResult = await (
    await textHandler.getProperty("innerText")
  ).jsonValue();

  const result = {
    name: file,
    result: overallResult,
  };

  return result;
};

const main = async () => {
  const files = await readFiles();

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://playground.bioid.com/");

  await wait(page);

  await page.click("body > main > div > div.row.mt-4 > div > a");

  await wait(page);

  const email = process.env.BIO_ID_EMAIL;
  const pw = process.env.BIO_ID_PW;
  await page.type("#Email", email);

  await page.type("#Password", pw);

  await page.click("#loginForm > div.card-footer > button")

  await page.waitForNavigation();

  await wait(page);

  const jsonToSave = [];

  for (file of files) {
    console.log("Die Datei " + file + " wird hochgeladen...");

    await page.goto("https://playground.bioid.com/VideoLiveDetection");
    await wait(page);

    console.log("Current location: " + await page.url())

    try {
      jsonToSave.push(await bioId(file, page));
      console.log(
        "Die Datei " + file + " wurde erfolgreich hochgeladen und verarbeitet!"
      );
    } catch (err) {
      console.log("Folgender Error ist aufgetreten: \n" + err);
    }
  }

  console.log("Alle Dateien wurden verarbeitet!");

  fs.writeFileSync(
    `bioid_save_${new Date().toISOString()}.json`,
    JSON.stringify(jsonToSave, null, 2)
  );

  await browser.close();
};

main();
