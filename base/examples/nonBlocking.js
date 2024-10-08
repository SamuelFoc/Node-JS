const http = require("http");

http.get("http://www.google.com", (res) => {
  // 1. This makes an HTTP GET request asynchronously.
  // Under the hood, libuv handles network sockets for reading/writing data.
  let data = "";

  res.on("data", (chunk) => {
    // 2. The `res.on('data')` event handler captures data as it's streamed.
    // libuv manages the underlying socket, making non-blocking reads as data arrives.
    data += chunk;
  });

  res.on("end", () => {
    // 3. When the response ends, the 'end' event is fired.
    // The event loop schedules the callback to print the accumulated data.
    console.log("Received data from Google:", data);
  });
});

console.log("HTTP request made asynchronously..."); // 4. This prints immediately since `http.get` is non-blocking.

// Behind the scenes:
// - `http.get` initiates an asynchronous request.
// - libuv manages the I/O operations for the network socket.
// - The main thread continues executing subsequent lines while data is gathered in the background.
// - libuv places the `data` and `end` callbacks in the event loop when ready, allowing Node.js to process them.
