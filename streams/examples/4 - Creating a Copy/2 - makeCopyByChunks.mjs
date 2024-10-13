import fs from "fs";
import { Buffer } from "buffer";

const FILE_PATH = "./original.txt";
const COPY_TO = "./copy.txt";

// * MEMMORY OPTIMIZED VERSION
// This version is not using STREAMS
// TIME: 2.85s
// RAM: 15MB
(async () => {
  console.time("copy");
  const srcFile = await fs.promises.open(FILE_PATH, "r");
  const destFile = await fs.promises.open(COPY_TO, "w");

  const file = await srcFile.stat();
  const fileSize = file.size;

  let bytesRead = 0;
  let finished = false;

  while (!finished) {
    let content = await srcFile.read();
    bytesRead += content.bytesRead;
    // Check if there is a free space in buffer
    let bufferSpace = bytesRead % 16384;
    if (bufferSpace !== 0) {
      const buff = Buffer.alloc(bufferSpace);
      content.buffer.copy(buff, 0, 0, bufferSpace);
      destFile.write(buff);
    } else {
      destFile.write(content.buffer);
    }
    // End copying if the file was transfered
    if (bytesRead === fileSize) {
      finished = true;
    }
  }
  console.timeEnd("copy");
})();
