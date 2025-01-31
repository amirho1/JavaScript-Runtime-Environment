import { EditorView } from "codemirror";
import { Engine } from "./engine";
import EventLoop from "./eventLoop";
import { Statement } from "acorn";
import Ui from "./ui";
import WebAPIs from "./webAPIs";
import Stack from "./Stack";
import Queue from "./Queue";
import ObservableMap from "./ObservableMap";

export default class Runtime {
  private stack = new Stack<Statement>();
  private taskQueue = new Queue<Statement>();
  private microTaskQueue = new Queue<Statement>();
  private map = new ObservableMap();
  private isStackEmpty = { value: true };
  private ui = new Ui("#stack", this.stack, this.taskQueue, this.microTaskQueue, this.map);
  private eventLoop = new EventLoop(this.microTaskQueue, this.taskQueue, this.isStackEmpty);
  private webApi = new WebAPIs(this.taskQueue, this.map);
  private engine = new Engine(
    this.stack,
    this.ui,
    this.webApi,
    this.isStackEmpty,
    this.microTaskQueue
  );

  constructor(private editor: EditorView) {}

  run() {
    const stackItemWrapper = document.getElementById("stack-items-wrapper");
    if (stackItemWrapper) stackItemWrapper.innerHTML = "";

    this.stack.clear();
    this.taskQueue.clear();
    this.microTaskQueue.clear();
    this.engine.run(this.editor.state.doc.toString());
    this.map.clear();

    this.taskQueue.on("enqueue", () => this.eventLoop.run(this.engine));
    this.microTaskQueue.on("enqueue", () => this.eventLoop.run(this.engine));
  }
}
