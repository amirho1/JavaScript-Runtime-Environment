import { EditorView } from "codemirror";
import { Engine } from "./engine";
import EventLoop from "./eventLoop";
import { Statement } from "acorn";
import Ui from "./ui";
import WebAPIs from "./webAPIs";
import Stack from "./Stack";
import Queue from "./Queue";

export default class Runtime {
  private stack = new Stack<Statement>();
  private taskQueue = new Queue<Statement>();
  private microTaskQueue = new Queue<Statement>();
  private map = new Map();
  private ui = new Ui("#stack", this.stack, this.taskQueue, this.microTaskQueue, this.map);
  private eventLoop = new EventLoop(this.ui);
  private webApi = new WebAPIs(this.taskQueue, this.ui, this.map);
  private engine = new Engine(this.stack, this.ui, this.webApi);

  constructor(private editor: EditorView) {}

  run() {
    const stackItemWrapper = document.getElementById("stack-items-wrapper");
    if (stackItemWrapper) stackItemWrapper.innerHTML = "";

    this.stack.clear();
    this.taskQueue.clear();
    this.microTaskQueue.clear();
    this.engine.run(this.editor.state.doc.toString());
    this.map.clear();
  }
}
