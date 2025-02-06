export const sampleCode1 = `console.log("Hello, World!");

async function asyncFunc() {

  await console.log("Async function");
  console.log("after await 0")
}

setTimeout(() => {
  console.log("Timeout function");
}, 0);

asyncFunc();

console.log("End of script");`;

export const stackOverFlow = `function one() {
  two()
};

function two() {
  one();
};

one();`;

export const setTimeoutCodeSnippet = `setTimeout(() => {
  console.log("Timeout function");
}, 0);

console.log("End of script");`;

export const stackOverFlowsampleCode2 = `function one() {
  two()
}

function two() {
  one()
}

one();
two();
`;

export const asyncSample = `async function asyncFunc() {
  await console.log("Async function");
  console.log("after await 0")
  console.log("after await 1")
}

asyncFunc()

console.log('end')
`;

export const promise = `new Promise((resolve, reject) => {
  console.log("Promise function");
}).then(() => {
console.log("then");
});

console.log('end')
`;

export const setTimeout = `setTimeout(() => {
  console.log("Timeout function");
}, 0);
`;

export const start = `setTimeout(() => {
  console.log("inside setTimeout");
}, 0);

async function one() {
  await console.log("one");
  one();
}

one();
`;
