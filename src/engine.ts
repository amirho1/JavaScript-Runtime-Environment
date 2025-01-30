import Stack from "./Stack";
import * as acorn from "acorn";
import * as astring from "astring";
import { ObjFunctionDeclaration } from "./types";
import UI from "./ui";
import WebAPIs from "./webAPIs";

export class Engine {
  private iterator: Generator | undefined;
  private parsedCode: acorn.Program | undefined;
  private stackOverFlowSize = 20;
  private timeout = 500;
  private funcDeclarations: ObjFunctionDeclaration = {};

  constructor(
    private stack: Stack<acorn.AnyNode>,
    private ui: UI,
    private webApi: WebAPIs,
    private isStackEmpty: { value: boolean }
  ) {
    this.iterate = this.iterate.bind(this);
  }

  run(code: string) {
    this.parsedCode = acorn.parse(code, { ecmaVersion: 2020 });

    // 1. Create the generator
    this.iterator = this.iterate(this.parsedCode);

    // 2. Drive the generator
    this.driveGenerator(this.iterator);
  }

  // This function coordinates the generator's async yields
  driveGenerator(gen: Generator) {
    this.ui?.disableRunButton();
    this.isStackEmpty.value = false;
    const nextVal = gen.next();

    if (nextVal.done) {
      this.isStackEmpty.value = true;
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

  isSetTimeout(node: acorn.AnyNode) {
    return (
      node.type === "ExpressionStatement" &&
      node.expression.type === "CallExpression" &&
      node.expression.callee.type === "Identifier" &&
      node.expression.callee.name === "setTimeout"
    );
  }

  captureStackOverFlow() {
    if (this.stackOverFlowSize === this.stack.size()) {
      this.ui?.callStackStopped();
      this.ui?.enableRunButton();
      this.ui?.explode(5000);

      throw new Error("maximum call stack size exceeded");
    }
  }

  evaluate(node: acorn.AnyNode) {
    if (this.isConsoleLog(node) && this.ui.console) {
      if (node.type === "ExpressionStatement") {
        if (node.expression.type === "CallExpression")
          this.ui.console.log(this.extractArgumentsFromCallExpression(node.expression));
      }
    }
  }

  *handleExpressionStatements(node: acorn.AnyNode, isSetTimeout: boolean) {
    if (node.type === "ExpressionStatement") {
      yield new Promise(resolve => setTimeout(resolve, this.timeout));
      this.stack.push(node);
      // show the UI we are pushing
      this.ui?.callStackIsRunning();
      if (node.expression.type === "CallExpression" && !isSetTimeout) {
        const callExpr = node.expression;
        if (callExpr.callee.type === "Identifier") {
          const funcDecl = this.funcDeclarations[callExpr.callee.name];
          if (funcDecl.async) {
            this.webApi.asyncFunction(node);
          } else {
            yield* this.iterate(funcDecl.body);
          }
        }
      }
    } else if (node.type === "ArrowFunctionExpression") {
      yield new Promise(resolve => setTimeout(resolve, this.timeout));
      this.stack.push(node);

      this.ui?.callStackIsRunning();
      yield* this.iterate(node.body);
    } else if (node.type === "FunctionDeclaration") {
      if (node.id) this.funcDeclarations[node.id.name] = node;
    }
  }

  *iterate(node: acorn.AnyNode): Generator<Promise<any> | void | any> {
    console.log(node, "node");

    this.captureStackOverFlow();

    const isSetTimeout = this.isSetTimeout(node);

    yield* this.handleExpressionStatements(node, isSetTimeout);

    // Evaluate
    this.evaluate(node);

    // Recurse if this node has a body
    if (Array.isArray((node as any)?.body)) {
      for (let n of (node as any).body) {
        yield* this.iterate(n);
      }
    }

    // pop from stack
    if (node.type === "ExpressionStatement" || node.type === "ArrowFunctionExpression") {
      this.ui?.callStackIsRunning();
      yield new Promise(resolve => setTimeout(resolve, this.timeout));
      this.stack.pop();
      this.ui?.callStackStopped();
    }
    if (isSetTimeout) {
      this.webApi.setTimeout(node.expression, node.expression.arguments[1].value);
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
