// ! this is a blocking function and run it for simulation of blocking code
function block() {
  const start = Date.now();
  // Loop continuously until 5 seconds have passed
  console.log(start);
  while (Date.now() - start < 5000) {
    // Do nothing - just block
  }
  console.log("Done blocking!");
}

export function blockFor5Seconds() {
  block();

  console.log("This line runs after blocking finishes.");
}

export function noneBlocking() {
  setTimeout(block, 0);
  console.log("this line runs before blocking finishes");
  return;
}
