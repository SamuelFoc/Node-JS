const fs = require("fs");

fs.readFile("example.txt", "utf8", (err, data) => {
  // 1. This function reads the file `example.txt` asynchronously.
  // Under the hood, libuv uses the appropriate system-level I/O calls to read the file.
  // If the platform is Linux, it might use `read()`; for Windows, a different API.
  // libuv provides a consistent way to perform this action regardless of OS.
  if (err) {
    console.error("Error reading file:", err); // 3. If there's an error, it will be printed here.
  } else {
    console.log("File contents:", data); // 4. If successful, print the file's contents.
  }
});

console.log("Reading file asynchronously..."); // 2. This line executes immediately because `readFile` is non-blocking.

// Behind the scenes:
// - `fs.readFile` is called and the request is handed over to libuv.
// - libuv delegates the operation to the appropriate system call, and continues without blocking.
// - Once the file is read, libuv places the callback into the event loop,
//   so the file data can be processed.
