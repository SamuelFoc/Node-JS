import fs from "fs";
import { Buffer } from "buffer";

const filePath = "./output.txt";

// * PROMISES API
// Execution Time: 12s
// CPU Usage: 50% (one core)
// Memory Usage: 3GB
// (async () => {
//   console.time("writeMany");
//   const fileHandle = await fs.promises.open(filePath, "w");
//   for (let i = 0; i < 1000000; i++) {
//     fileHandle.write(`ISO-T: ${new Date().toISOString()}\n`);
//   }
//   console.timeEnd("writeMany");
// })();

// * CALLBACK API
// Execution Time: 5s
// CPU Usage: 25% (one core)
// Memory Usage: 10MB
// (async () => {
//   console.time("writeMany");
//   fs.open(filePath, "w", (err, fd) => {
//     for (let i = 0; i < 1000000; i++) {
//       fs.writeSync(fd, `ISO-T: ${new Date().toISOString()}\n`);
//     }
//     console.timeEnd("writeMany");
//   });
// })();

// * STREAMS
// ! THIS IS NOT A GOOD PRACTICE !
// Execution Time: 1.5s
// CPU Usage: 25% (one core)
// Memory Usage: 250MB
(async () => {
  console.time("writeMany");
  const fileHandle = await fs.promises.open(filePath, "w");

  const stream = fileHandle.createWriteStream();
  for (let i = 0; i < 1000000; i++) {
    const buff = Buffer.from(`ISO-T: ${new Date()}\n`);
    stream.write(buff);
  }
  console.timeEnd("writeMany");
})();
