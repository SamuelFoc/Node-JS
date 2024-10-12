import fs from "fs";

const FILE_PATH = "./bigdata.txt";
const DESTINATION_PATH = "./copy_of_bigdata.txt";

const copyFile = async (src, dest) => {
  const fileReader = await fs.promises.open(src, "r");
  const fileWriter = await fs.promises.open(dest, "w");

  let bytesRead = 0;
  const fileStats = await fileReader.stat();
  const fileSize = fileStats.size;

  const readStream = fileReader.createReadStream({
    highWaterMark: 128 * 1024,
  });
  const writeStream = fileWriter.createWriteStream();

  readStream.on("data", (chunk) => {
    const spaceInQueue = writeStream.write(chunk);
    if (!spaceInQueue) readStream.pause();
    bytesRead += chunk.length;
  });

  writeStream.on("drain", () => {
    process.stdout.write(
      `Copying: ${((bytesRead / fileSize) * 100).toFixed(2)}%\r`
    );
    readStream.resume();
  });

  readStream.on("end", async () => {
    await fileReader.close();
    await fileWriter.close();
    console.log("\nFile has been copyed!");
  });
};

copyFile(FILE_PATH, DESTINATION_PATH);
