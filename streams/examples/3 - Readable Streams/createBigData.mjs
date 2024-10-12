import fs from "fs";
import { Buffer } from "buffer";

// * SETTINGS
const FILE_PATH = "./bigdata.txt";
const N_ROWS = 100000000;
const CHUNK_SIZE = 10000; // Write 10,000 rows in a single chunk for efficiency
const HIGH_WATER_MARK = 128 * 1024; // Increase buffer size

(async () => {
  const fileHandler = await fs.promises.open(FILE_PATH, "w");
  const stream = fileHandler.createWriteStream({
    highWaterMark: HIGH_WATER_MARK,
  });

  let i = 0;

  // Function to generate a chunk of data
  const generateChunk = (startIndex, count) => {
    let chunk = "";
    for (let j = 0; j < count && startIndex + j < N_ROWS; j++) {
      chunk += `${startIndex + j},\n`;
    }
    return Buffer.from(chunk);
  };

  const writeMany = () => {
    while (i < N_ROWS) {
      const remainingRows = N_ROWS - i;
      const rowsToWrite = Math.min(CHUNK_SIZE, remainingRows); // Write either chunk size or remaining rows
      const chunk = generateChunk(i, rowsToWrite);

      // Write the chunk to the stream
      const spaceInQueue = stream.write(chunk);
      i += rowsToWrite;

      if (!spaceInQueue) {
        break;
      }
    }

    // End the stream once all rows are written
    if (i === N_ROWS) {
      stream.end();
    }
  };

  writeMany();

  stream.on("finish", async () => {
    await fileHandler.close();
    console.log("\nFile written successfully!");
  });

  stream.on("drain", () => {
    process.stdout.write(
      `Writing to a file: ${((i / N_ROWS) * 100).toFixed(2)}%\r`
    );
    writeMany();
  });
})();
