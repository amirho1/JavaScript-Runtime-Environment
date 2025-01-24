import ExplosiveButton from "./explosion";
import { UI } from "./types";

export default class Ui extends ExplosiveButton implements UI {
  constructor(selector: string) {
    super(selector);
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

  enableRunButton() {
    const run = document.querySelector("#run");
    if (run && run instanceof HTMLButtonElement) run.disabled = false;
  }

  disableRunButton() {
    const run = document.querySelector("#run");
    if (run && run instanceof HTMLButtonElement) run.disabled = true;
  }
}
