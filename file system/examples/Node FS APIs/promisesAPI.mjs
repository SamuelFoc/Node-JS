import fs from "fs";

const writeData = async () => {
  try {
    await fs.promises.writeFile(
      "./promises.txt",
      "This file was created by FS Promises API!"
    );

    return await fs.promises.readFile("./promises.txt", {
      encoding: "utf8",
    });
  } catch (err) {
    console.error(err);
    return -1;
  }
};

console.log(await writeData());
