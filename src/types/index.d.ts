import { Statement } from "acorn";

export interface Console {
  log: (...args: any[]) => void;
}

export interface EngineParams {
  stack: Stack<acorn.Statement>;
  console: Console;
  ui: UI;
  webApi?: WebAPIs;
}

export interface ObjFunctionDeclaration {
  [key: string]: FunctionDeclaration | AnonymousFunctionDeclaration;
}

export interface Task {
  [key: string]: Expression;
}
