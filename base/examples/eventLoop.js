console.log("Start"); // 1. Prints 'Start' immediately since this is synchronous code.

setTimeout(() => {
  // 2. setTimeout schedules this function to be executed after 2 seconds.
  // Under the hood, libuv manages the timer. Once the time is up,
  // the callback is added to the event loop's callback queue.
  console.log("Executed after 2 seconds");
}, 2000);

console.log("End"); // 3. Prints 'End' immediately because the `setTimeout` is asynchronous and doesn't block the execution.

// Behind the scenes:
// - Node.js calls `setTimeout`, and libuv starts a timer for 2 seconds.
// - The main thread continues executing subsequent lines without waiting.
// - After 2 seconds, libuv adds the callback to the event loop's "timer" phase,
//   and the callback is executed during that phase.
