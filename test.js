const fs = require("fs");

class SimpleReadableStream {
  constructor(filePath, chunkSize = 16) {
    this.filePath = filePath; // Path to the file to read
    this.chunkSize = chunkSize; // Size of each chunk
    this.position = 0; // Current read position in the file
    this.buffer = []; // Buffer queue to store data
    this.isReading = false; // Indicates if the stream is currently reading
    this.fileStream = fs.createReadStream(this.filePath, {
      highWaterMark: this.chunkSize, // Set chunk size for the file stream
    });

    // Listen for data and end events from the file stream
    this.fileStream.on("data", (chunk) => this.push(chunk));
    this.fileStream.on("end", () => this.end());
    this.fileStream.on("error", (err) => this.error(err));
  }

  // Push data into the buffer
  push(chunk) {
    this.buffer.push(chunk); // Add the chunk to the buffer
    console.log(`Buffered chunk: ${chunk.length} bytes`); // Log buffered chunk
  }

  // Pull data from the buffer
  pull() {
    if (this.buffer.length > 0) {
      const chunk = this.buffer.shift(); // Get the first chunk from the buffer
      console.log(`Pulled chunk: ${chunk.length} bytes`); // Log pulled chunk
      return chunk; // Return the chunk for processing
    }
    return null; // No more data available
  }

  // Start the reading process
  start() {
    if (!this.isReading) {
      this.isReading = true; // Mark as reading
      this.readData(); // Begin reading data
    }
  }

  // Internal method to read data continuously
  readData() {
    const chunk = this.pull(); // Pull data from the buffer
    if (chunk) {
      // Here you can process the chunk as needed
      console.log(`Processing chunk: ${chunk.toString()}`); // Example processing
      // Call readData again to continue processing more data
      setImmediate(() => this.readData());
    } else {
      console.log("No more data to process.");
      this.isReading = false; // Mark as not reading anymore
    }
  }

  // Handle end of stream
  end() {
    console.log("End of stream reached.");
    this.isReading = false; // Mark as not reading anymore
  }

  // Handle errors
  error(err) {
    console.error("Error reading the file:", err);
    this.isReading = false; // Stop reading on error
  }
}

// Example usage
const stream = new SimpleReadableStream("largefile.txt", 16); // Adjust the path and chunk size
stream.start(); // Start reading data
