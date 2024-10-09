// (o) This is a buffer
const code = buff
  .toString("utf8")
  .split("\n")
  .map((line) => line.replace(/;/g, ""))
  .join("\n");

console.log(code);
