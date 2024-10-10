import fs from "fs";

const filePath = "./output.txt";

(async () => {
  console.time("writeMany");
  const fileHandle = await fs.promises.open(filePath, "w");

  for (let i = 0; i < 1000000; i++) {
    fileHandle.write(`ISO-T: ${new Date().toISOString()}\n`);
  }
  console.timeEnd("writeMany");
})();
