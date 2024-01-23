const data = props.data ?? "# Hello World\n\n";
const embedCss = props.embedCss || "";

const code = `
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
<script src="https://unpkg.com/react-markdown-editor-lite@1.3.4/lib/index.js" crossorigin></script>
<link rel="stylesheet" href="https://unpkg.com/react-markdown-editor-lite@1.3.4/lib/index.css" />

<style>
${embedCss}
</style>

<div id="react-root"></div>

<script>
let isEditorInitialized = false;
let editorInstance = null;
function MarkdownEditor(props) {
  const [value, setValue] = React.useState(props.initialText || "");
  const updateEditorState = (text) => {
    setValue(text);
    window.top.postMessage(text, "*");
  };
  editorInstance = { updateEditorState };
  return React.createElement(ReactMarkdownEditorLite.default, {
      value,
      view: { menu: true, md: true, html: false },
      canView: { menu: true, md: false, html: false, fullScreen: false, hideMenu: true },
      onChange: ({ text }) => {
        updateEditorState(text)
      },
      renderHTML: () => {},
      className: "full",
    }); 
}

const domContainer = document.querySelector('#react-root');
const root = ReactDOM.createRoot(domContainer);

window.addEventListener("message", (event) => {
  if (!isEditorInitialized) {
    root.render(React.createElement(MarkdownEditor, {
        initialText: event.data.content }));
        isEditorInitialized = true;
  } else {
    if (event.data.handler === 'autocompleteSelected') {
      if (editorInstance) {
        editorInstance.updateEditorState(event.data.content);
      }
      }
  }
});

</script>
`;
return (
  <iframe
    className="w-100 h-100"
    srcDoc={code}
    message={data}
    onMessage={props.onChange}
  />
);
