import fs from "fs";

console.log("Start\n");

console.log("Reading File: input.txt");
const data = fs.readFileSync("./input.txt", "utf8");

console.log("Copying to: output.txt");
fs.writeFileSync("./output.txt", data, "utf8");

console.log("Reading file: outpput.txt");
const new_file_data = fs.readFileSync("./output.txt", "utf8");

console.log(`\nData:\n\t${new_file_data}\n`);

console.log("See how it runs synchronously!");
