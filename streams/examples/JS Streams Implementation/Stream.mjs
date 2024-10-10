export default class CreateStream {
  #filePath;

  constructor(filepath) {
    this.#filePath = filepath;
  }

  #readFileInChunks() {
    // PARAMS: file_path, chunk_size, stopped
    // FUNC: Read a given file content in chunks and return them one by one
  }

  #enqueue() {
    // PARAMS: chunk
    // FUNC: Push the chunk into the queue
  }

  #dequeue() {
    // PARAMS: -
    // FUNC: Return the chunk from the top of the queue
  }

  #stop() {
    // PARAMS: -
    // FUNC: Stop reading if it is running
  }

  startStream() {
    // FUNC: - Start reading the file and enqueuing the chunks
    //       - Dequeue the chunks and return them one by one to
    //       - the user in different freq. than the reading process
  }
}
