let counter = 0;

const interval = setInterval(() => {
  // 1. setInterval schedules a callback every 1 second.
  // libuv manages the interval timing, and once 1 second passes, the callback is added to the event loop.
  console.log(`Interval fired: ${++counter}`);

  if (counter === 5) {
    clearInterval(interval);
    console.log("Interval cleared");
  }
}, 1000);

console.log("Interval started..."); // 2. Prints immediately because setInterval is non-blocking.

// Behind the scenes:
// - `setInterval` instructs libuv to create a timer that fires every second.
// - libuv places the interval callback in the event loop's "timer" phase each time it expires.
// - The callback increments `counter`, and when `counter === 5`, `clearInterval` stops further executions.
