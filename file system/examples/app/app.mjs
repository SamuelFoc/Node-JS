import fs from "fs";

const FILE_TO_WATCH = "./file.js";

(async () => {
  const commandFileHandler = await fs.promises.open(FILE_TO_WATCH, "r");

  commandFileHandler.on("change", async () => {
    // Get the size of our file
    const size = (await commandFileHandler.stat()).size;
    // Allocate buffer with the size of the file
    const buff = Buffer.alloc(size);
    // Where to start filling the buffer
    const offset = 0;
    // How many bytes to read
    const length = buff.byteLength;
    // Where to start reading the file from
    const position = 0;
    // Read the whole content
    await commandFileHandler.read(buff, offset, length, position);

    console.log(buff.toString("utf8"));
  });

  // watcher..
  const watcher = fs.promises.watch(FILE_TO_WATCH);
  for await (const event of watcher) {
    console.log(event.eventType);
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();
