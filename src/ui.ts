import ExplosiveButton from "./explosion";
import Stack from "./Stack";
import hljs from "highlight.js";
import * as astring from "astring";
import * as acorn from "acorn";
import { FunctionElement, Task } from "./types";
import Queue from "./Queue";

export default class Ui extends ExplosiveButton {
  constructor(
    stackSelector: string,
    private stack: Stack<acorn.Statement>,
    private taskQueue: Queue<acorn.Statement>,
    private microTaskQueue: Queue<acorn.Statement>,
    private map: Task
  ) {
    super(stackSelector);

    // ** Bind methods
    this.addClass = this.addClass.bind(this);
    this.removeClass = this.removeClass.bind(this);
    this.callStackIsRunning = this.callStackIsRunning.bind(this);
    this.callStackStopped = this.callStackStopped.bind(this);
    this.addElementToCallStackToUI = this.addElementToCallStackToUI.bind(this);
    this.removeElementFromCallStackUI = this.removeElementFromCallStackUI.bind(this);
    this.addElementToWebAPIsUI = this.addElementToWebAPIsUI.bind(this);
    this.removeElementFromWebAPIsUI = this.removeElementFromWebAPIsUI.bind(this);
    this.createFunctionElementAndAppend = this.createFunctionElementAndAppend.bind(this);
    this.addElementToTaskQueueUI = this.addElementToTaskQueueUI.bind(this);
    this.removeTheFirstElementFromTaskQueue = this.removeTheFirstElementFromTaskQueue.bind(this);
    this.clearChildElements = this.clearChildElements.bind(this);
    this.addElementToMicroTaskQueue = this.addElementToMicroTaskQueue.bind(this);
    this.removeTheFirstElementFromMicroTaskQueue =
      this.removeTheFirstElementFromMicroTaskQueue.bind(this);

    // ** Add event listeners
    this.stack.on("push", this.addElementToCallStackToUI);
    this.stack.on("pop", () => this.removeLastChildFromSelected("#stack-items-wrapper"));

    this.map.on("set", this.addElementToWebAPIsUI);
    this.map.on("delete", this.removeElementFromWebAPIsUI);
    this.map.on("clear", () => this.clearChildElements("#web-apis-items-wrapper"));

    this.taskQueue.on("enqueue", this.addElementToTaskQueueUI);
    this.taskQueue.on("dequeue", this.removeTheFirstElementFromTaskQueue);
    this.taskQueue.on("clear", () => this.clearChildElements("#task-queue-items-wrapper"));

    this.microTaskQueue.on("enqueue", this.addElementToMicroTaskQueue);
    this.microTaskQueue.on("dequeue", this.removeTheFirstElementFromMicroTaskQueue);
    this.microTaskQueue.on("clear", () =>
      this.clearChildElements("#micro-task-queue-items-wrapper")
    );
  }

  addElementToMicroTaskQueue() {
    this.createFunctionElementAndAppend({
      code: astring.generate(this.microTaskQueue.peek()),
      appendToSelector: "#micro-task-queue-items-wrapper",
    });
  }

  removeTheFirstElementFromMicroTaskQueue() {
    document.querySelector("#micro-task-queue-items-wrapper")?.firstChild?.remove();
  }

  console = {
    log(...args: any[]) {
      const logElement = document.createElement("div");
      const consoleElement = document.querySelector(".item-wrapper");
      const innerHTML = args.reduce((prev, arg) => `${prev} ${arg}`, "");
      logElement.innerHTML = innerHTML;
      consoleElement?.appendChild(logElement);
      logElement.scrollIntoView();
    },
  };

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

  enableRunButton() {
    const run = document.querySelector("#run");
    if (run && run instanceof HTMLButtonElement) run.disabled = false;
  }

  disableRunButton() {
    const run = document.querySelector("#run");
    if (run && run instanceof HTMLButtonElement) run.disabled = true;
  }

  createFunctionElementAndAppend({ appendToSelector, code, id }: FunctionElement) {
    const element = document.querySelector(appendToSelector);
    const funcElement = document.createElement("div");

    const highlightedCode = hljs.highlight(code, { language: "javascript" }).value;

    funcElement.innerHTML = highlightedCode;
    funcElement?.classList.add("stack-element");
    funcElement.id = id || "";

    element?.appendChild(funcElement);
    funcElement.scrollIntoView();
  }

  addElementToCallStackToUI() {
    this.createFunctionElementAndAppend({
      code: astring.generate(this.stack.peek()),
      appendToSelector: "#stack-items-wrapper",
    });
  }

  removeLastChildFromSelected(selector: string) {
    document.querySelector(selector)?.lastChild?.remove();
  }

  removeElement(selector: string) {
    const element = document.querySelector(selector);
    if (element) element.remove();
  }

  removeElementFromCallStackUI() {
    this.removeLastChildFromSelected("#stack-items-wrapper");
  }

  addElementToWebAPIsUI(id: string, code: acorn.Expression) {
    this.createFunctionElementAndAppend({
      code: astring.generate(code),
      appendToSelector: "#web-apis-items-wrapper",
      id,
    });
  }

  removeElementFromWebAPIsUI(id: string) {
    const element = document.getElementById(id);
    if (element) element.remove();
  }

  addElementToTaskQueueUI(code: acorn.Expression) {
    this.createFunctionElementAndAppend({
      code: astring.generate(code),
      appendToSelector: "#task-queue-items-wrapper",
    });
  }

  removeTheFirstElementFromTaskQueue() {
    document.querySelector("#task-queue-items-wrapper")?.firstChild?.remove();
  }

  clearChildElements(selector: string) {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = "";
  }
}
