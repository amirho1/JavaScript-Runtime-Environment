import { EditorView, basicSetup } from "codemirror";
import { Compartment } from "@codemirror/state";
import { dracula } from "@ddietr/codemirror-themes/dracula";
import { javascript } from "@codemirror/lang-javascript";
import { stackOverFlow } from "./initialSampleCode";

const languageConf = new Compartment();

const editor = new EditorView({
  doc: stackOverFlow,
  extensions: [basicSetup, languageConf.of(javascript()), dracula],
  parent: document.querySelector("#editor") as HTMLElement,
});

editor.focus();

export default editor;
