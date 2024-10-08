import fs from "fs";

// Define the file path to watch
const filePath = "./File Watching/fileToWatch.txt";

// Function to convert buffer to binary string
function bufferToBinaryString(buffer) {
  return Array.from(buffer) // Convert each byte to an array
    .map((byte) => byte.toString(2).padStart(8, "0")) // Convert to binary and pad to 8 bits
    .join(" "); // Join all binary strings with spaces
}

// Function to convert Buffer to HEX and split by two characters
function bufferToHexSplit(buffer) {
  return buffer
    .toString("hex")
    .match(/.{1,2}/g)
    .join(" "); // Split into pairs of two characters
}

// Immediately Invoked Async Function
(async () => {
  // Watch for changes to the file
  fs.watch(filePath, async (eventType, filename) => {
    if (eventType === "change") {
      console.log(`File ${filename} was changed..`);

      try {
        // Read the file content
        const content = await fs.promises.readFile(filePath);

        // Log the original Buffer
        console.log("Original Buffer:", content);

        // Log the content as HEX
        console.log("HEX Buffer:", content.toString("hex"));

        // Filtering out zeros from the buffer
        const filteredBuffer = Buffer.from(
          Array.from(content).filter((item) => item !== 0)
        );

        // Log the filtered buffer in HEX and binary
        console.log("Filtered Buffer (HEX):", bufferToHexSplit(filteredBuffer)); // HEX split by two characters
        console.log(
          "Filtered Buffer (BIN):",
          bufferToBinaryString(filteredBuffer)
        );

        // Log the filtered buffer as UTF-8
        console.log(
          "Filtered Buffer (UTF-8):",
          filteredBuffer
            .toString("utf8")
            .match(/[\x00-\x7F\u00A0-\uFFFF]/g)
            .join(" ")
        );
      } catch (err) {
        console.error("Error reading file:", err);
      }
    }
  });

  console.log(`Watching for changes in ${filePath}...`);
})();
