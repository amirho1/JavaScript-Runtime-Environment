import { Statement } from "acorn";
import Queue from "./Queue";
import { Task } from "./types";
import { v4 } from "uuid";
import Ui from "./ui";
import * as astring from "astring";
import { Expression } from "acorn";

export default class WebAPIs {
  private tasks: Task;

  constructor(private taskQueue: Queue<Statement>, private ui: Ui) {
    this.tasks = {};
  }

  setTimeout(Node: Expression, time: number) {
    const id = v4();

    this.tasks[id] = Node;
    this.ui.addElementToWebAPIsUI(astring.generate(Node));
    time = time < 500 ? 1000 : time;

    setTimeout(() => {
      this.taskQueue.enqueue((Node as any).arguments[0]);
      this.ui.removeLastElementFromWebAPIsUI();
      this.ui.addElementToTaskQueueUI(astring.generate((Node as any).arguments[0]));
      delete this.tasks[id];
    }, time);

    return id;
  }

  async asyncFunction(statement: Statement) {
    const id = v4();
    this.tasks[id] = statement;
    this.ui.addElementToWebAPIsUI(astring.generate(statement));

    await new Promise(resolve => {
      setTimeout(() => {
        this.taskQueue.enqueue(statement);
        delete this.tasks[id];
        resolve(true);
      }, 1000);
    });
  }
}
