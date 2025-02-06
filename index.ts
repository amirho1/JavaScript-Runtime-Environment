import editor from "./src/editor";
import Runtime from "./src/runtime";
import javascript from "highlight.js/lib/languages/javascript";
import hljs from "highlight.js";
import { blockFor5Seconds, noneBlocking } from "./src/helpers";

const runtime = new Runtime(editor);

(function IIFE() {
  hljs.registerLanguage("javascript", javascript);
  editor.focus();

  const runButton = document.getElementById("run");

  runButton?.addEventListener("click", () => {
    runtime.run();
  });

  // ! this is a none blocking function does the same as blockFor5Seconds()
  // noneBlocking()
  // ! blocking for five second
  // blockFor5Seconds();
})();
