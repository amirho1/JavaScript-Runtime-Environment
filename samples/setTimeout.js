console.log("start of module");

function helloWorld() {
  console.log("Hello world");
}

setTimeout(function () {
  console.log("Hello world from settimeout");
}, 1000);

helloWorld();

console.log("end of module");
