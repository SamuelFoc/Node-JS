import fs from "fs";

const FILE_PATH = "./original.txt";
const COPY_TO = "./copy.txt";
const LOGGING_LOADING = false;

// TIME: 1.6s
// RAM: 15MB
(async () => {
  console.time("copy");
  const srcFile = await fs.promises.open(FILE_PATH, "r");
  const destFile = await fs.promises.open(COPY_TO, "w");

  const readStream = srcFile.createReadStream({
    highWaterMark: 64 * 1024,
  }); // 64kB Internal Buffer
  const writeStream = destFile.createWriteStream({
    highWaterMark: 16 * 1024,
  }); // 16kB Internal Buffer

  // Initialize transfer watching
  let bytesRead = 0;
  let fileStats = await srcFile.stat();
  const fileSize = fileStats.size;

  // When there are data in the READABLE internal buffer
  readStream.on("data", (chunk) => {
    let spaceInQueue = writeStream.write(chunk);
    if (!spaceInQueue) readStream.pause();
    bytesRead += chunk.length;
  });

  // When WRITABLE internal buffer is emptied
  writeStream.on("drain", () => {
    if (LOGGING_LOADING) {
      process.stdout.write(
        `Copying - ${(bytesRead / 1000).toFixed(2)}kB / ${(
          fileSize / 1000
        ).toFixed()}kB\r`
      );
    }
    readStream.resume();
  });

  // When the READABLE internal buffer is emptied (no more data)
  readStream.on("end", async () => {
    writeStream.end();
    await srcFile.close();
    await destFile.close();
  });

  writeStream.on("finish", () => {
    console.log("\nFile has been copied!");
    console.timeEnd("copy");
  });
})();
