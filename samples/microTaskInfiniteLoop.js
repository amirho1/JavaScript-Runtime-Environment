setTimeout(() => {
  console.log("inside setTimeout");
}, 0);

function one() {
  queueMicrotask(() => {
    console.log("one");
    one();
  });
}

queueMicrotask(() => {
  one()
});


