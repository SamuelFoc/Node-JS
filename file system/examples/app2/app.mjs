import fs from "fs";
import crypto from "crypto";

const FILE_TO_WATCH = "./file.js";
let lastFileHash = ""; // Store the last file hash to prevent infinite loops
let debounceTimeout = null; // Store the timeout ID for debouncing

(async () => {
  // Open the file for reading and writing
  const commandFileHandler = await fs.promises.open(FILE_TO_WATCH, "r+");

  // Function to calculate the hash of the file content
  const calculateFileHash = async (fileHandle) => {
    const stats = await fileHandle.stat();
    const size = stats.size;
    const buff = Buffer.alloc(size);

    // Read the file content into the buffer
    await fileHandle.read(buff, 0, size, 0);

    // Return the hash of the buffer
    return crypto.createHash("sha256").update(buff).digest("hex");
  };

  // Event listener for file changes
  commandFileHandler.on("change", async () => {
    // Clear the previous debounce timeout if it exists
    clearTimeout(debounceTimeout);

    // Set a new debounce timeout
    debounceTimeout = setTimeout(async () => {
      try {
        // Calculate the current file hash
        const currentFileHash = await calculateFileHash(commandFileHandler);

        // Check if the file hash is different from the last recorded hash
        if (currentFileHash === lastFileHash) {
          return; // Skip if the hashes are the same (self-modified)
        }

        // Update the lastFileHash to the current hash after processing
        lastFileHash = currentFileHash;

        // Get the size of the file
        const size = (await commandFileHandler.stat()).size;
        const buff = Buffer.alloc(size);
        await commandFileHandler.read(buff, 0, size, 0);

        // Remove semicolons and join lines
        const code = buff
          .toString("utf8")
          .split("\n")
          .map((line) => line.replace(/\(o\)/g, "⚙️"))
          .join("\n");

        // Write the modified content back to the file
        await fs.promises.writeFile(FILE_TO_WATCH, code, "utf-8");
        console.log("File updated successfully.");
      } catch (err) {
        console.error("Error processing file:", err);
      }
    }, 200); // Set debounce delay (200ms)
  });

  // Watch the file for changes
  const watcher = fs.promises.watch(FILE_TO_WATCH);

  for await (const event of watcher) {
    if (event.eventType === "change") {
      commandFileHandler.emit("change"); // Emit the 'change' event when the file changes
    }
  }
})();
