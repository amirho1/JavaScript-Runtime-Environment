import { Statement } from "acorn";
import ObservableMap from "../ObservableMap";

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

export type Task = ObservableMap<string, Expression>;

export interface FunctionElement {
  appendToSelector: string;
  code: string;
  id?: string;
}
