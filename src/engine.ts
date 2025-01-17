import Stack from "./Stack";
import * as acorn from "acorn";
import * as astring from "astring";
import { Console, EngineParams, UI } from "./types";

export class Engine {
  private stack: Stack<acorn.Statement>;
  private iterator: Generator | undefined;
  private parsedCode: acorn.Program | undefined;
  private stackOverFlowSize = 20;
  private console: Console | undefined;
  private ui: UI | undefined;

  constructor({ stack, console, ui }: EngineParams) {
    this.stack = stack;
    this.console = console;
    this.ui = ui;

    this.clearStack = this.clearStack.bind(this);
    this.stack.onPop(() => {
      const iterator = this.clearStack();
      const iterate = () => {
        const result = iterator.next();
        if (!result.done) {
          result.value.then(iterate);
        }
      };
      iterate();
    });
  }

  run(code: string) {
    this.parsedCode = acorn.parse(code, { ecmaVersion: 2020 });
    this.iterator = this.iterate(this.parsedCode?.body);
    this.iterator.next();
  }

  *iterate(body: (acorn.Statement | acorn.ModuleDeclaration)[]) {
    for (const statement of body) {
      switch (statement.type) {
        // case "VariableDeclaration":
        //   yield this.handleVariableDeclaration(statement);
        //   break;
        case "ExpressionStatement":
          this.ui?.callStackIsRunning();

          yield new Promise(resolve => {
            this.handleExpressionStatement(statement);
            resolve(true);
          });
          break;

        // case "IfStatement":
        //   yield this.handleIfStatement(statement);
        //   break;
        // case "WhileStatement":
        //   yield this.handleWhileStatement(statement);
        //   break;
        // case "ForStatement":
        //   yield this.handleForStatement(statement);
        //   break;
        // case "ReturnStatement":
        //   yield this.handleReturnStatement(statement);
        //   break;
        // case "FunctionDeclaration":
        //   yield this.handleFunctionDeclaration(statement);
        //   break;
      }
    }
  }

  findFunctionDeclarationByName(name: string) {
    if (this.parsedCode) {
      for (const statement of this.parsedCode.body) {
        if (statement.type === "FunctionDeclaration" && statement.id?.name === name) {
          return statement;
        }
      }
    }
  }

  isConsoleLog(topItem: acorn.Statement) {
    if (topItem.type === "ExpressionStatement" && topItem.expression.type === "CallExpression") {
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

    return false;
  }

  expressionStatement(item: acorn.CallExpression) {
    if (item.callee.type === "Identifier") {
      const funcDeclaration = this.findFunctionDeclarationByName(item.callee.name);
      if (funcDeclaration) {
        this.iterator = this.iterate(funcDeclaration.body.body);
        this.iterator.next();
      }
    }
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
      }
    });
  }

  *clearStack() {
    while (this.stack.size() > 0) {
      this.ui?.callStackIsRunning();

      yield new Promise(resolve => {
        setTimeout(() => {
          this.stack.pop();
          this.ui?.callStackStopped();
          resolve(true);
        }, 1000);
      });
    }
  }

  executeTopStackItem() {
    if (this.stack.size() > this.stackOverFlowSize) {
      this.ui?.callStackStopped();
      throw new Error("Maximum call stack size exceeded");
    }
    const topItem = this.stack.peek();

    if (this.isConsoleLog(topItem)) {
      setTimeout(() => {
        this.stack.pop();
        if (
          this.console &&
          topItem.type === "ExpressionStatement" &&
          topItem.expression.type === "CallExpression"
        )
          this.console.log(this.extractArgumentsFromCallExpression(topItem.expression));
      }, 1000);
    } else if (
      topItem.type === "ExpressionStatement" &&
      topItem.expression.type === "CallExpression"
    ) {
      this.expressionStatement(topItem.expression);
    }
  }

  handleExpressionStatement(statement: acorn.Statement) {
    return setTimeout(() => {
      this.stack.push(statement);
      this.executeTopStackItem();
    }, 1000);
  }

  handleVariableDeclaration(_statement: acorn.Statement) {
    console.log("VariableDeclaration");
  }

  handleIfStatement(_statement: acorn.Statement) {
    console.log("IfStatement");
  }

  handleWhileStatement(_statement: acorn.Statement) {
    console.log("WhileStatement");
  }

  handleForStatement(_statement: acorn.Statement) {
    console.log("ForStatement");
  }

  handleReturnStatement(_statement: acorn.Statement) {
    console.log("ReturnStatement");
  }

  handleFunctionDeclaration(_statement: acorn.Statement) {
    console.log("FunctionDeclaration");
  }
}
