console.log("start of module");

const promise = new Promise(resolve => {
  console.log("inside promise");
  resolve("hello");
});

promise.then(data => console.log("inside then", data)).then(() => console.log("4"));

// * this or that ^

async function asynchronous() {
  await console.log("inside async promise ");

  console.log("inside then");
  await console.log("inside async promise 2");

  console.log('3')
}

asynchronous()

console.log("end of module");
