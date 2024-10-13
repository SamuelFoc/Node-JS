import fs from "fs";
import { Writable } from "stream";

export default class FileWriteSream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
    this.internalBuffer = [];
    this.internalBufferSize = 0;
    this.writesCount = 0;
  }

  // Called after the constructor
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }

  // Called when the <>.write() method is called.
  // Writable (parent class) calls the _write()
  // internally when the write() is called
  _write(chunk, encoding, callback) {
    this.internalBuffer.push(chunk);
    this.internalBufferSize += chunk.length;

    if (this.internalBufferSize > this.highWaterMark) {
      fs.write(this.fd, Buffer.concat(this.internalBuffer), (err) => {
        if (err) {
          return callback(err);
        }
        this.internalBuffer = [];
        this.internalBufferSize = 0;
        ++writesCount;
        callback();
      });
    } else {
      callback();
    }
  }

  // Called after <>.end() method is called
  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.internalBuffer), (err) => {
      if (err) return callback(err);
      this.internalBuffer = [];
      ++this.writesCount;
      callback();
    });
  }

  // Called as a callback after the _final method
  _destroy(error, callback) {
    console.log("Number of writes:", this.writesCount);
    if (this.fd) {
      fs.close(this.fd, (err) => callback(err | error));
    } else {
      callback(error);
    }
  }
}
