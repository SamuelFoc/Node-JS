const crypto = require("crypto");

console.log("Start hashing"); // 1. Synchronous operation that prints immediately.

crypto.pbkdf2("password", "salt", 100000, 12, "sha512", (err, derivedKey) => {
  // 2. pbkdf2 is a CPU-intensive operation, and libuv handles it by offloading it to the thread pool.
  // This prevents the main thread from being blocked while the hash calculation is performed.
  if (err) throw err;
  console.log("Hash calculated:", derivedKey.toString("hex")); // 5. This prints once the hash is calculated by a worker thread.
});

console.log("End hashing"); // 3. Prints immediately because `pbkdf2` is non-blocking.

// Behind the scenes:
// - `crypto.pbkdf2` calls into a native C++ function to perform the hashing.
// - libuv offloads this to one of the worker threads in the thread pool (default size is 4).
// - The thread performs the hashing, while the main thread continues.
// - Once hashing is complete, libuv places the callback in the event loop so Node.js can handle it.
