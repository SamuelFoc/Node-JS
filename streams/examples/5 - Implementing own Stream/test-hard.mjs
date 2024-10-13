import fs from "fs";
import { Buffer } from "buffer";
import FileWriteSream from "./customWritable.mjs";

const DEST_PATH = "./copy.txt";

// Using our custom implementation
// TIME: s
// RAM: MB
(async () => {
  console.time("write");
  //   const destFile = await fs.promises.open(DEST_PATH, "w");
  const stream = new FileWriteSream({
    highWaterMark: 16 * 1024,
    fileName: "test.txt",
  }); // 16kB Internal Buffer

  let i = 0;
  const numOfWrites = 1000000;

  const writeMany = () => {
    while (i < numOfWrites) {
      const buff = Buffer.from(`${i}\n`);
      stream.write(buff);
      if (i === numOfWrites - 1) {
        return stream.end(buff);
      }
      if (!stream.write(buff)) break;

      i++;
    }
  };

  writeMany();

  stream.on("drain", () => {
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("write");
  });
})();
