export default class EventEmitter {
  #listeners;
  #once_listeners;

  constructor() {
    this.#listeners = {};
    this.#once_listeners = {};
  }

  on(event, callback) {
    if (event in this.#listeners) {
      this.#listeners[event].push(callback);
    } else {
      this.#listeners[event] = [callback];
    }
  }

  emit(event, ...args) {
    if (event in this.#listeners) {
      this.#listeners[event].forEach((func) => func(...args));
    }
    if (event in this.#once_listeners) {
      this.#once_listeners[event].forEach((func) => func(...args));
      delete this.#once_listeners[event];
    }
  }

  once(event, callback) {
    if (event in this.#once_listeners) {
      this.#once_listeners[event].push(callback);
    } else {
      this.#once_listeners[event] = [callback];
    }
  }

  #_removeCallback(event, callback, list) {
    if (event in list) {
      list[event] = list[event].filter((func) => func !== callback);
    }
  }

  removeListener(event, callback) {
    this.#_removeCallback(event, callback, this.#listeners);
    this.#_removeCallback(event, callback, this.#once_listeners);
  }

  removeAllListeners(event) {
    if (event in this.#listeners) {
      delete this.#listeners[event];
    }
    if (event in this.#once_listeners) {
      delete this.#once_listeners[event];
    }
  }

  listeners(event) {
    return this.#listeners[event] || [];
  }
}
