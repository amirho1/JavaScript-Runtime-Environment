import editor from "./src/editor";
import Runtime from "./src/runtime";
import javascript from "highlight.js/lib/languages/javascript";
import hljs from "highlight.js";

const runtime = new Runtime(editor);

(function IIFE() {
  hljs.registerLanguage("javascript", javascript);
  editor.focus();

  const runButton = document.getElementById("run");

  runButton?.addEventListener("click", () => {
    runtime.run();
  });
})();
