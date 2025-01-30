import ObservableMethods from "./ObservableMethod";

/**
 * A class representing a Queue data structure.
 */
@ObservableMethods
export default class Queue<T = any> {
  /**
   * The internal array representing the queue.
   * @private
   */
  private queue: T[] = [];

  /**
   * Creates an instance of Queue.
   * @param args - Initial elements to populate the queue.
   */
  constructor(...args: T[]) {
    this.queue = args;
  }

  /**
   * Adds an item to the end of the queue.
   * @param item - The item to be added to the queue.
   */
  public enqueue(item: T) {
    this.queue.push(item);
  }

  /**
   * Checks if the queue is empty.
   * @returns A boolean indicating whether the queue is empty.
   */
  isEmpty() {
    return this.queue.length === 0;
  }

  /**
   * Returns the item at the front of the queue without removing it.
   * @returns The item at the front of the queue.
   */
  peek() {
    return this.queue[0];
  }

  /**
   * Removes and returns the item at the front of the queue.
   * @returns The item that was removed from the front of the queue.
   */
  dequeue() {
    return this.queue.shift();
  }

  /**
   * Returns the number of items in the queue.
   * @returns The size of the queue.
   */
  size() {
    return this.queue.length;
  }

  /**
   * Clears all the elements in the queue.
   * This method resets the queue to an empty state.
   */
  clear() {
    this.queue = [];
  }
}
