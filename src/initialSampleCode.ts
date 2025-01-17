export const sampleCode1 = `console.log("Hello, World!");

async function asyncFunc() {
  console.log("Async function");
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

export const sampleCode2 = `function one() {
  console.log('hello from one')
}

function two() {
  console.log('hello from two')
}

one();
two();
`;
