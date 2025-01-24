import Stack from "./Stack";
import * as acorn from "acorn";
import * as astring from "astring";
import { Console, EngineParams, ObjFunctionDeclaration, UI } from "./types";

export class Engine {
  private stack: Stack<acorn.AnyNode>;
  private iterator: Generator | undefined;
  private parsedCode: acorn.Program | undefined;
  private stackOverFlowSize = 20;
  private console: Console | undefined;
  private ui: UI | undefined;
  private timeout = 500;
  private funcDeclarations: ObjFunctionDeclaration = {};

  constructor({ stack, console, ui }: EngineParams) {
    this.stack = stack;
    this.console = console;
    this.ui = ui;
  }

  run(code: string) {
    this.ui?.disableRunButton();
    this.parsedCode = acorn.parse(code, { ecmaVersion: 2020 });

    // 1. Create the generator
    this.iterator = this.iterate(this.parsedCode);

    // 2. Drive the generator
    this.driveGenerator(this.iterator);
  }

  // This function coordinates the generator's async yields
  private driveGenerator(gen: Generator) {
    const nextVal = gen.next();
    if (nextVal.done) {
      // All done with iteration
      this.ui?.enableRunButton();

      return;
    }

    // If the yielded value is a promise, wait for it
    if (nextVal.value instanceof Promise) {
      nextVal.value.then(() => this.driveGenerator(gen));
    } else {
      // Otherwise, just keep going
      this.driveGenerator(gen);
    }
  }

  private *iterate(node: acorn.AnyNode): Generator<Promise<any> | void | any> {
    if (this.stackOverFlowSize === this.stack.size()) {
      this.ui?.callStackStopped();
      this.ui?.enableRunButton();
      this.ui?.explode(2000);

      throw new Error("maximum call stack size exceeded");
    }

    if (node.type === "ExpressionStatement") {
      yield new Promise(resolve => setTimeout(resolve, this.timeout));

      this.stack.push(node);
      // show the UI we are pushing
      this.ui?.callStackIsRunning();

      if (node.expression.type === "CallExpression") {
        const callExpr = node.expression;
        if (callExpr.callee.type === "Identifier") {
          const funcDecl = this.funcDeclarations[callExpr.callee.name];

          if (funcDecl) {
            yield* this.iterate(funcDecl.body);
          }
        }
      }
    } else if (node.type === "FunctionDeclaration") {
      if (node.id) this.funcDeclarations[node.id.name] = node;
    }

    // Evaluate
    if (this.isConsoleLog(node) && this.console) {
      if (node.type === "ExpressionStatement") {
        if (node.expression.type === "CallExpression")
          this.console.log(this.extractArgumentsFromCallExpression(node.expression));
      }
    }

    // Recurse if this node has a body
    if (Array.isArray((node as any)?.body)) {
      for (let n of (node as any).body) {
        yield* this.iterate(n);
      }
    }

    // pop from stack
    if (node.type === "ExpressionStatement") {
      this.ui?.callStackIsRunning();
      yield new Promise(resolve => setTimeout(resolve, this.timeout));
      this.stack.pop();
      this.ui?.callStackStopped();
    }
  }

  isConsoleLog(topItem: acorn.AnyNode) {
    if (topItem.type === "ExpressionStatement") {
      if (topItem.expression.type === "CallExpression") {
        if (topItem.expression.callee.type === "MemberExpression") {
          if (
            topItem.expression.callee.object.type === "Identifier" &&
            topItem.expression.callee.object.name === "console"
          ) {
            if (
              topItem.expression.callee.property.type === "Identifier" &&
              topItem.expression.callee.property.name === "log"
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  evaluateBinaryExpression(arg: acorn.BinaryExpression) {
    return new Function(`return ${astring.generate(arg)}`)();
  }

  extractArgumentsFromCallExpression(callExpression: acorn.CallExpression): any[] {
    const args = callExpression.arguments;

    return args.map(arg => {
      switch (arg.type) {
        case "Literal":
          return arg.value;
        case "BinaryExpression":
          return this.evaluateBinaryExpression(arg);
        case "CallExpression":
          return this.extractArgumentsFromCallExpression(arg);
        default:
          return undefined;
      }
    });
  }
}
