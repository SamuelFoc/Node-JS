import fs from "fs";

const FILE_PATH = "./original.txt";
const COPY_TO = "./copy.txt";

// TIME: 1.6s
// RAM: 15MB
(async () => {
  console.time("copy");
  const srcFile = await fs.promises.open(FILE_PATH, "r");
  const destFile = await fs.promises.open(COPY_TO, "w");

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  readStream.pipe(writeStream);

  readStream.on("end", () => console.timeEnd("copy"));
})();
