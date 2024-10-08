import fs from "fs";

const filePath = "./File Watching/fileToWatch.txt";

(async () => {
  const watcher = fs.promises.watch(filePath);

  for await (const event of watcher) {
    if (event.eventType === "change") {
      console.log(`File ${event.filename} was changed..`);
    }
  }
})();
