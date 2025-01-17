import editor from "./src/editor";
import Runtime from "./src/runtime";

const runtime = new Runtime(editor);

(function IIFE() {
  editor.focus();

  const runButton = document.getElementById("run");

  runButton?.addEventListener("click", () => {
    runtime.run();
  });
})();
