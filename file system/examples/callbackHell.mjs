import fs from "fs";

// -----------  CALLBACK API  -----------------
//In the Callback API version, the code can quickly become nested and hard to read, often referred to as "callback hell."
fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    return console.error("Error reading input file:", err);
  }

  fs.writeFile("output.txt", data, (err) => {
    if (err) {
      return console.error("Error writing output file:", err);
    }

    fs.readFile("output.txt", "utf8", (err, outputData) => {
      if (err) {
        return console.error("Error reading output file:", err);
      }
      console.log("Output Data:", outputData);
    });
  });
});

// -----------  PROMISES API  -----------------
const promises = fs.promises;

const processFiles = async () => {
  try {
    const data = await promises.readFile("input.txt", "utf8");
    await promises.writeFile("output.txt", data);
    const outputData = await promises.readFile("output.txt", "utf8");
    console.log("Output Data:", outputData);
  } catch (err) {
    console.error("Error:", err);
  }
};

processFiles();
