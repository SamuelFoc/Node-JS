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
// (async () => {
//   console.time("writeManySTREAM");
//   const fileHandle = await fs.promises.open(filePath, "w");

//   const stream = fileHandle.createWriteStream();
//   for (let i = 0; i < 1000000; i++) {
//     const buff = Buffer.from(`ISO-T: ${new Date()}\n`);
//     stream.write(buff);
//   }
//   console.timeEnd("writeManySTREAM");
// })();

// * How To Simulate Stream
// ! This aproach is not handling backpressure (can cause memory overload) !
// Execution Time: 1.45s
// CPU Usage: 40% (one core)
// Memory Usage: 50MB
(async () => {
  console.time("writeManySOS");
  const fileHandle = await fs.promises.open(filePath, "w");
  let queue = [];
  for (let i = 0; i < 1000000; i++) {
    const buff = Buffer.from(`ISO-T: ${new Date().toISOString()}\n`);
    queue.push(buff);
    if (i % 8000 === 0 && queue.length > 0) {
      await fileHandle.write(Buffer.concat(queue));
      queue = [];
    }
  }
  // Write remainings
  if (queue.length > 0) {
    await fileHandle.write(Buffer.concat(queue));
  }
  // Close the file connection
  await fileHandle.close();
  console.timeEnd("writeManySOS");
})();
