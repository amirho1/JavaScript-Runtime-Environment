console.log("module start");

function one() {
  two();
}

function two() {
  one();
}

one();

console.log("module end");
