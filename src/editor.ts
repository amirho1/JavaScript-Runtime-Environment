import { EditorView, basicSetup } from "codemirror";
import { Compartment } from "@codemirror/state";
import { dracula } from "@ddietr/codemirror-themes/dracula";
import { javascript } from "@codemirror/lang-javascript";
import debounce from "debounce";

const languageConf = new Compartment();

function handleEditorChange() {
  console.log(editor.state.doc.toString());
}

const handleUpdate = EditorView.updateListener.of(debounce(handleEditorChange, 500));

const editor = new EditorView({
  doc: 'console.log("hello")',
  extensions: [basicSetup, languageConf.of(javascript()), dracula, handleUpdate],
  parent: document.querySelector("#editor") as HTMLElement,
});

editor.focus();

// Function to get the text value from the editor
function getEditorValue() {
  return editor.state.doc;
}
