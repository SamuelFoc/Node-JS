import fs from "fs";

const FILE_PATH = "./original.txt";
const COPY_TO = "./copy.txt";

// ! RUNNING THIS CODE CAN FREEZE YOUR PC !
// TIME: 1.5s
// RAM: 1GB (size of the copied file)
(async () => {
  console.time("copy");
  const srcFileContent = await fs.promises.readFile(FILE_PATH);
  const destFile = await fs.promises.open(COPY_TO, "w");

  await destFile.write(srcFileContent);
  console.timeEnd("copy");
})();
