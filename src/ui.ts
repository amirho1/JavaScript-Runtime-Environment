import ExplosiveButton from "./explosion";
import Stack from "./Stack";
import hljs from "highlight.js";
import * as astring from "astring";
import * as acorn from "acorn";

export default class Ui extends ExplosiveButton {
  constructor(stackSelector: string, private stack: Stack<acorn.Statement>) {
    super(stackSelector);
    this.addClass = this.addClass.bind(this);
    this.removeClass = this.removeClass.bind(this);
    this.callStackIsRunning = this.callStackIsRunning.bind(this);
    this.callStackStopped = this.callStackStopped.bind(this);

    this.addElementFromCallStackToUI = this.addElementFromCallStackToUI.bind(this);
    this.removeElementFromCallStackUI = this.removeElementFromCallStackUI.bind(this);
    this.removeLastElementFromWebAPIsUI = this.removeLastElementFromWebAPIsUI.bind(this);
    this.addElementToWebAPIsUI = this.addElementToWebAPIsUI.bind(this);

    this.stack.onPush(this.addElementFromCallStackToUI);
    this.stack.onPop(this.removeElementFromCallStackUI);
  }

  console = {
    log(...args: any[]) {
      const log = document.createElement("div");
      const consoleElement = document.querySelector(".item-wrapper");
      const innerHTML = args.reduce((prev, arg) => `${prev} ${arg}`, "");
      log.innerHTML = innerHTML;
      consoleElement?.appendChild(log);
      log.scrollIntoView();
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

  createFunctionElementAndAppend({
    appendToSelector,
    code,
  }: {
    appendToSelector: string;
    code: string;
  }) {
    const element = document.querySelector(appendToSelector);
    const funcElement = document.createElement("div");
    const highlightedCode = hljs.highlight(code, { language: "javascript" }).value;

    funcElement.innerHTML = highlightedCode;
    funcElement?.classList.add("stack-element");

    element?.appendChild(funcElement);
    funcElement.scrollIntoView();
  }

  addElementFromCallStackToUI() {
    this.createFunctionElementAndAppend({
      code: astring.generate(this.stack.peek()),
      appendToSelector: "#stack-items-wrapper",
    });
  }

  removeLastChildFromSelected(selector: string) {
    document.querySelector(selector)?.lastChild?.remove();
  }

  removeElementFromCallStackUI() {
    this.removeLastChildFromSelected("#stack-items-wrapper");
  }

  addElementToWebAPIsUI(code: string) {
    this.createFunctionElementAndAppend({
      code: code,
      appendToSelector: "#web-apis-items-wrapper",
    });
  }

  removeLastElementFromWebAPIsUI() {
    this.removeLastChildFromSelected("#web-apis-items-wrapper");
  }

  addElementToTaskQueueUI(code: string) {
    this.createFunctionElementAndAppend({
      code: code,
      appendToSelector: "#task-queue-items-wrapper",
    });
  }

  removeTheFirstElementFromTaskQueue() {
    document.querySelector("#task-queue-items-wrapper")?.firstChild?.remove();
  }
}
