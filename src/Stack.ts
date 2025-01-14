/**
 * A class representing a stack data structure.
 *
 * @class Stack
 * @template T - The type of elements held in the stack.
 */
export default class Stack {
  /**
   * The internal array that holds the stack elements.
   *
   * @private
   * @type {T[]}
   */
  private stack: any[] = [];

  /**
   * Creates an instance of Stack.
   *
   * @param {...T[]} args - Initial elements to populate the stack.
   */
  constructor(...args: any[]) {
    this.stack = args;
  }

  /**
   * Adds an element to the top of the stack.
   *
   * @param {T} arg - The element to add.
   * @returns {number} The new length of the stack.
   */
  push(arg: any) {
    return this.stack.push(arg);
  }

  /**
   * Removes and returns the top element of the stack.
   *
   * @returns {T | undefined} The removed element, or undefined if the stack is empty.
   */
  pop() {
    return this.stack.pop();
  }

  /**
   * Returns the top element of the stack without removing it.
   *
   * @returns {T | undefined} The top element, or undefined if the stack is empty.
   */
  peek() {
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
   * Returns the number of elements in the stack.
   *
   * @returns {number} The number of elements in the stack.
   */
  size() {
    return this.stack.length;
  }
}
