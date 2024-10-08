import EventEmitter from "./EventEmitter.mjs";

const ee = new EventEmitter();

const greeting = (x, y) => {
  console.log(`Hi, ${x} and ${y}!`);
};
const welcome = (x, y) => {
  console.log(`${x}, ${y} you're welcome!`);
};

ee.on("greet", greeting);
ee.once("once", greeting);
ee.on("greet", welcome);

console.log("Emitting greet:");
ee.emit("greet", "Alice", "Bob");

console.log("Emitting once:");
ee.emit("once", "Josh", "Jana");

console.log("Emitting once again:");
ee.emit("once", "Josh", "Jana");

console.log("Reading listeners:");
console.log(ee.listeners("greet"));

console.log("Removing greeting listener:");
ee.removeListener("greet", greeting);

console.log("Reading listeners:");
console.log(ee.listeners("greet"));
