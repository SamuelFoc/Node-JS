import fs from "fs";

const FILE_PATH = "./output.txt";

// Create writable stream with a custom highWaterMark of 32 KB
// * High Water Mark is a size of an internal Buffer (queue)
// * where smaller Buffers (chunks of data) are stored before
// * actual writing to the file (see the custom implementation)
// * of the stream in "1 - Write Many Times/writeMany.mjs"
const writableStream = fs.createWriteStream(FILE_PATH, {
  highWaterMark: 32 * 1024,
});

console.log("writableHighWaterMark:", writableStream.writableHighWaterMark); // 32 KB
console.log("writableLength:", writableStream.writableLength); // Initially 0
console.log("writableFinished:", writableStream.writableFinished); // Initially false
console.log("writableEnded:", writableStream.writableEnded); // Initially false
console.log("writableCorked:", writableStream.writableCorked); // Initially 0
console.log("writableObjectMode:", writableStream.writableObjectMode); // false

// Write some data
writableStream.write("Hello, World!", "utf8", () => {
  console.log("Data has been written to the stream.");
  console.log("writableLength:", writableStream.writableLength); // Buffer might contain data

  // End the stream
  writableStream.end(() => {
    console.log("Stream ended.");
    console.log("writableFinished:", writableStream.writableFinished); // true after ending
    console.log("writableEnded:", writableStream.writableEnded); // true after ending
    console.log("closed:", writableStream.closed); // true after stream is fully closed
  });
});
