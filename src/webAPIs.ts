import { Statement } from "acorn";
import Queue from "./Queue";
import { Task } from "./types";
import { v4 } from "uuid";
import { Expression } from "acorn";

export default class WebAPIs {
  private tasks: Task;

  constructor(private taskQueue: Queue<Statement>, map: Task) {
    this.tasks = map;
  }

  setTimeout(Node: Expression, time: number) {
    const id = v4();

    this.tasks.set(id, Node);
    time = time < 500 ? 1000 : time;

    setTimeout(() => {
      this.taskQueue.enqueue((Node as any).arguments[0]);
      this.tasks.delete(id);
    }, time);

    return id;
  }

  async asyncFunction(statement: Statement) {
    const id = v4();
    this.tasks.set(id, statement);

    await new Promise(resolve => {
      setTimeout(() => {
        this.taskQueue.enqueue(statement);
        this.tasks.delete(id);
        resolve(true);
      }, 1000);
    });
  }
}
