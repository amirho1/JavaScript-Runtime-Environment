export interface Console {
  log: (...args: any[]) => void;
}

export interface UI {
  addClass: (selector: string, classname: string) => void;
  callStackIsRunning: () => void;
  callStackStopped: () => void;
}

export interface EngineParams {
  stack: Stack<acorn.Statement>;
  console: Console;
  ui: UI;
}

