import { Engine } from "./engine";
import Queue from "./Queue";
import { Statement } from "acorn";

export default class EventLoop {
  private running = false;
  private intervalId?: number;

  /**
   * @param microTaskQueue - The microtask queue
   * @param taskQueue      - The task queue
   * @param stack          - The call stack
   * @param engine         - The engine of Javascript
   */
  constructor(
    private microTaskQueue: Queue<Statement>,
    private taskQueue: Queue<Statement>,
    private isStackEmpty: { value: boolean }
  ) {}

  /**
   * Starts the event loop, periodically checking microTaskQueue first,
   * then taskQueue, and pushing items to the call stack.
   */
  run(engine: Engine) {
    if (this.running) return; // Prevent multiple intervals

    this.running = true;

    this.intervalId = window.setInterval(() => {
      // 1. Check the microtask queue
      const microtask = this.microTaskQueue.peek();
      // start only if the stack is empty
      if (this.isStackEmpty.value) {
        if (microtask) {
          const iterator = engine.iterate(microtask);
          engine.driveGenerator(iterator);
          this.microTaskQueue.dequeue();

          return;
        } else {
          // 2. If no microtask, check the task queue
          const task = this.taskQueue.peek();
          if (task) {
            const iterator = engine.iterate(task);
            engine.driveGenerator(iterator);
            this.taskQueue.dequeue();
          } else {
            // 3. If both queues are empty, stop the loop
            if (this.intervalId) {
              clearInterval(this.intervalId);
              this.intervalId = undefined;
            }
            this.running = false;
          }
        }
      }
    }, 200);
  }
}
