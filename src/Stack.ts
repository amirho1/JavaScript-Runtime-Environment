/**
 * A class representing a stack data structure.
 *
 * @class Stack
 * @template T - The type of items held in the stack.
 */
export default class Stack<T> {
  /**
   * The internal array that holds the stack items.
   *
   * @private
   * @type {T[]}
   */
  private stack: any[] = [];

  /**
   * The internal array that holds the subscribed events for push.
   *
   * @private
   * @type {Function[]}
   */
  private pushEvents: Function[] = [];

  /**
   * The internal array that holds the subscribed events for push.
   *
   * @private
   * @type {Function[]}
   */
  private popEvents: Function[] = [];

  /**
   * Creates an instance of Stack.
   *
   * @param {...T[]} args - Initial items to populate the stack.
   */
  constructor(...args: T[]) {
    this.stack = args;
    this.pop = this.pop.bind(this);
    this.peek = this.peek.bind(this);
    this.isEmpty = this.isEmpty.bind(this);
    this.size = this.size.bind(this);
    this.onPush = this.onPush.bind(this);
    this.onPop = this.onPop.bind(this);
    this.handlePushEvents = this.handlePushEvents.bind(this);
    this.handlePopEvents = this.handlePopEvents.bind(this);
    this.clear = this.clear.bind(this);
  }

  /**
   * Adds an item to the top of the stack.
   *
   * @param {T} arg - The item to add.
   * @returns {number} The new length of the stack.
   */
  push(arg: T) {
    const length = this.stack.push(arg);
    this.handlePushEvents();
    this.handlePushEvents.bind(this);
    return length;
  }

  /**
   * Removes and returns the top item of the stack.
   *
   * @returns {T} The removed item, or undefined if the stack is empty.
   */
  pop(): T {
    const item = this.stack.pop();
    this.handlePopEvents();
    return item;
  }

  /**
   * Returns the top item of the stack without removing it.
   *
   * @returns {T} The top item, or undefined if the stack is empty.
   */
  peek(): T {
    return this.stack[this.stack.length - 1];
  }

  /**
   * Checks if the stack is empty.
   *
   * @returns {boolean} True if the stack is empty, false otherwise.
   */
  isEmpty() {
    return this.stack.length === 0;
  }

  /**
   * Returns the number of items in the stack.
   *
   * @returns {number} The number of items in the stack.
   */
  size() {
    return this.stack.length;
  }

  /**
   * Add callback to the pushEvents array.
   */
  onPush(fn: () => any) {
    this.pushEvents.push(fn);
  }

  /**
   * Add callback to the popEvents array.
   */
  onPop(fn: () => any) {
    this.popEvents.push(fn);
  }

  /**
   * Execute all the callbacks in the changeEvents array.
   */
  handlePushEvents() {
    this.pushEvents.forEach(fn => fn());
  }

  /**
   * Execute all the callbacks in the popEvents array.
   */
  handlePopEvents() {
    this.popEvents.forEach(fn => fn());
  }

  /**
   * Clear the stack.
   */
  clear() {
    this.stack = [];
  }
}
