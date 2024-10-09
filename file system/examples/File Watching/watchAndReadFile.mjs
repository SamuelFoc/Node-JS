import fs from "fs/promises";

const file_path = "./File Watching/fileToWatch.txt";

(async () => {
  const commandFileHandler = await fs.open(file_path);
  const watcher = fs.watch(file_path);

  for await (const event of watcher) {
    if (event.eventType === "change") {
      console.log("File was changed..");

      const content = await commandFileHandler.read();
      console.log(content);
    }
  }
})();
