import fs from "fs";
import { Buffer } from "buffer";

const FILE_PATH = "./output.txt";

// (async () => {
//   // Get the FD identifier for given file
//   const fileHandle = await fs.promises.open(FILE_PATH, "w");
//   // Create writable stream
//   const stream = fileHandle.createWriteStream();
//   // Create 100MB buffer filled with 10s
//   const buff = Buffer.alloc(16384, 10);
//   // Write the 16.384kB buffer into the stream, so the
//   // stream has full internal buffer now
//   stream.write(buff);
//   // ! BAD PRACTICE ALERT !
//   // We write another byte into the stream but the
//   // internal buffer already reached the limit (we're overwhelming the stream)
//   stream.write(Buffer.alloc(1, "a"));

//   // The "drain" event is emitted when the internal buffer is empty again.
//   // In other words, the writing of the provided data is done
//   stream.on("drain", () => {
//     console.log(
//       "We have reached a limit of the internal buffer and we emptied it!"
//     );
//   });
// })();

(async () => {
  // Get the FD identifier for the given file
  const fileHandle = await fs.promises.open(FILE_PATH, "w");
  // Create writable stream
  const stream = fileHandle.createWriteStream();

  let i = 0;

  const writeMany = () => {
    // Write data until the buffer is full (write returns false)
    while (i < 1000000) {
      const buff = Buffer.from(`Iteration: ${i}\n`, "utf-8");
      let spaceInBuffer = stream.write(buff);

      // If buffer is full, stop writing and wait for 'drain' event
      if (!spaceInBuffer) {
        console.log("Buffer is full, waiting for drain...");
        break;
      }

      i++;
    }

    // If the writing completed, end the stream
    if (i === 1000000) {
      stream.end();
    }
  };

  // Write data initially
  writeMany();

  // Resume writing when buffer drains
  stream.on("drain", () => {
    console.log("Buffer drained, resuming writing...");
    writeMany();
  });

  // Handle the 'finish' event after the stream has ended
  stream.on("finish", async () => {
    await fileHandle.close();
    console.log("File written and closed successfully.");
  });
})();
