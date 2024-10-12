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
    highWaterMark: 128 * 1024, // 128kB HWM
  });
  const writeStream = fileWriter.createWriteStream({
    highWaterMark: 16 * 1024, // 16kB HWM
  });

  readStream.on("data", (chunk) => {
    const numbers = chunk.toString("utf-8").split(",");
    const numsToWrite = numbers
      .filter((number) => parseInt(number) % 100 === 0)
      .join(" ");
    const spaceInQueue = writeStream.write(numsToWrite);
    if (!spaceInQueue) readStream.pause();
    bytesRead += chunk.length;
    process.stdout.write(
      `Copying: ${((bytesRead / fileSize) * 100).toFixed(2)}%\r`
    );
  });

  writeStream.on("drain", () => {
    console.log("Drained..");
    readStream.resume();
  });

  readStream.on("end", async () => {
    await fileReader.close();
    await fileWriter.close();
    console.log("\nFile has been copied!");
  });
};

copyFile(FILE_PATH, DESTINATION_PATH);
