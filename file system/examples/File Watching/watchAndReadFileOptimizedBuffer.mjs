import fs from "fs/promises";

const file_path = "./File Watching/fileToWatch.txt";

(async () => {
  const commandFileHandler = await fs.open(file_path, "r");

  const watcher = fs.watch(file_path);

  for await (const event of watcher) {
    if (event.eventType === "change") {
      console.log("File was changed..");

      const size = (await commandFileHandler.stat()).size;
      const content = await commandFileHandler.read(Buffer.alloc(size));

      console.log(content);
    }
  }
})();
