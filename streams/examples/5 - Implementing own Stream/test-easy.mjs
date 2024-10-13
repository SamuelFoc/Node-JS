import FileWriteSream from "./customWritable.mjs";
import { Buffer } from "buffer";

const stream = new FileWriteSream({
  highWaterMark: 1800,
  fileName: "test.txt",
});

stream.write(Buffer.from("test"));
stream.end();
