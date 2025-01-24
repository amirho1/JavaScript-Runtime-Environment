import { EditorView } from "codemirror";
import { Engine } from "./engine";
import EventLoop from "./eventLoop";
import Queue from "./Queue";
import Stack from "./Stack";
import { Statement } from "acorn";
import Ui from "./ui";
import WebAPIs from "./webAPIs";

export default class Runtime {
  private stack: Stack<Statement>;
  private taskQueue: Queue<Statement>;
  private microTaskQueue: Queue<Statement>;
  private engine: Engine;
  private eventLoop: EventLoop;
  private webApi: WebAPIs | undefined;
  private ui: Ui;

  constructor(private editor: EditorView) {
    this.stack = new Stack<Statement>();
    this.taskQueue = new Queue();
    this.webApi = new WebAPIs(this.taskQueue);
    this.microTaskQueue = new Queue();
    this.ui = new Ui("#stack", this.stack);
    this.engine = new Engine(this.stack, this.ui, this.webApi);

    this.eventLoop = new EventLoop();
  }

  run() {
    const stackItemWrapper = document.getElementById("stack-items-wrapper");
    if (stackItemWrapper) stackItemWrapper.innerHTML = "";
    this.stack.clear();

    this.engine.run(this.editor.state.doc.toString());
  }
}
