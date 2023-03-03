const fs = require("fs");
const fs_promis = require("fs/promises");

const recursiveReadFiles = async (directory) => {
  const dir = await fs_promis.readdir(`${directory}`);
  const files = [];
  const newDirs = [];

  for (f of dir) {
    if (fs.lstatSync(`${directory}/${f}`).isDirectory()) {
      newDirs.push(`${directory}/${f}`);
    } else {
      files.push(`${directory}/${f}`);
    }
  }

  for (n of newDirs) {
    files.push(await recursiveReadFiles(n));
  }

  return files.flat();
};

const filterFiles = (files) => {
  const filterdFiles = [];
  const regexFilter = /(:Zone\.Identifier)/;

  for (file of files) {
    if (!regexFilter.test(file)) {
      filterdFiles.push(file);
    }
  }

  return filterdFiles;
};

const readFiles = async () => {
  const files = await recursiveReadFiles("./Videos");
  return filterFiles(files)
};

exports.readFiles = readFiles;
