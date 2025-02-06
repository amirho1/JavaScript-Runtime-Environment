console.log("Hello, World!");

async function asyncFunc() {

  await console.log("Async function");
  console.log("after await 0")
}

setTimeout(() => {
  console.log("Timeout function");
}, 0);

asyncFunc();

console.log("End of script");


// Hello, World!
// Async function
// after await 0
// End of script
// Timeout function