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
