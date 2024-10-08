import fs from "fs";

// Encoding types: utf8, base64, ascii, hex, ucs2, latin1, binary
console.log("Writing file");

fs.writeFile("./test.txt", "Hello, world!", "utf8", () => {
  console.log("File has been written!");
});

// Test readability, accessibility or writeability
fs.access("./test.txt", fs.constants.F_W, (err) => {
  console.log(`File is: ${err ? "non-writable" : "writable"}`);
});

// Change mode (permissions) for the file
fs.chmod("./test.txt", 0o400, (err) => {
  if (err) throw err;
  console.log("The permission for file ./test.txt have been changed!");
});

// Copy file (wont work after running it once)
fs.copyFile("./test.txt", "copy_of_test.txt", (err) => {
  if (err) throw err;
  console.log("File has been copied!");
});

// Make a directory
fs.mkdir("./dir1", (err) => {
  if (err) throw err;
  console.log("Directory created!");
});

fs.mkdir("./dir2", (err) => {
  if (err) throw err;
  console.log("Directory created!");
});

// Copy directory
fs.cp("./dir1", "./dir2", (err) => {
  if (err) throw err;
  console.log("Directory coppied!");
});

// Append to the file or create and append (run twice to see, how it appends)
fs.appendFile("./testAppend.txt", "Testing data!", "utf8", (err) => {
  if (err) throw err;
  console.log("Data was appended to file!");
});

console.log("End");
