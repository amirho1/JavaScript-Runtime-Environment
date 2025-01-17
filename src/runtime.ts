import { EditorView } from "codemirror";
import { Engine } from "./engine";
import EventLoop from "./eventLoop";
import Queue from "./Queue";
import Stack from "./Stack";
import { Statement } from "acorn";
import * as astring from "astring";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import { Console, UI } from "./types";

hljs.registerLanguage("javascript", javascript);

class Ui implements UI {
  constructor() {
    this.addClass = this.addClass.bind(this);
    this.removeClass = this.removeClass.bind(this);
    this.callStackIsRunning = this.callStackIsRunning.bind(this);
    this.callStackStopped = this.callStackStopped.bind(this);
  }

  addClass(selector: string, classname: string) {
    const bd = document.querySelector(selector);
    bd?.classList.add(classname);
  }

  removeClass(selector: string, classname: string) {
    const bd = document.querySelector(selector);
    bd?.classList.remove(classname);
  }

  callStackIsRunning() {
    this.addClass("#stack .backdrop", "d-flex");
  }

  callStackStopped() {
    this.removeClass("#stack .backdrop", "d-flex");
  }
}

export default class Runtime {
  private stack: Stack<Statement>;
  private taskQueue: Queue;
  private microTaskQueue: Queue;
  private engine: Engine;
  private eventLoop: EventLoop;
  private editor: EditorView;
  private console: Console = {
    log(...args: any[]) {
      const log = document.createElement("div");
      const consoleElement = document.querySelector(".item-wrapper");
      const innerHTML = args.reduce((prev, arg) => `${prev} ${arg}`, "");
      log.innerHTML = innerHTML;
      consoleElement?.appendChild(log);
      log.scrollIntoView();
    },
  };

  private ui = new Ui();

  constructor(editor: EditorView) {
    this.stack = new Stack<Statement>();
    this.taskQueue = new Queue();
    this.microTaskQueue = new Queue();
    this.engine = new Engine({ stack: this.stack, console: this.console, ui: this.ui });
    this.eventLoop = new EventLoop();
    this.editor = editor;

    this.addElementFromCallStackToUI = this.addElementFromCallStackToUI.bind(this);
    this.removeElementFromCallStackUI = this.removeElementFromCallStackUI.bind(this);

    this.stack.onPush(this.addElementFromCallStackToUI);
    this.stack.onPop(this.removeElementFromCallStackUI);
  }

  run() {
    const stackItemWrapper = document.getElementById("stack-items-wrapper");
    if (stackItemWrapper) stackItemWrapper.innerHTML = "";
    this.stack.clear();

    this.engine.run(this.editor.state.doc.toString());
  }

  addElementFromCallStackToUI() {
    const element = document.getElementById("stack-items-wrapper");
    const funcElement = document.createElement("div");
    const code = astring.generate(this.stack.peek());
    const highlightedCode = hljs.highlight(code, { language: "javascript" }).value;

    funcElement.innerHTML = highlightedCode;
    funcElement?.classList.add("stack-element");

    element?.appendChild(funcElement);
    funcElement.scrollIntoView();
    // this.ui.callStackStopped();
  }

  removeElementFromCallStackUI() {
    document.getElementById("stack-items-wrapper")?.lastChild?.remove();
    // this.ui.callStackStopped();
  }
}
