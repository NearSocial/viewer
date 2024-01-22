/**
 * iframe embedding a SimpleMDE component
 * https://github.com/sparksuite/simplemde-markdown-editor
 */

function defaultOnChange(content) {
  console.log(content);
}

const data = props.data;
const onChange = props.onChange ?? defaultOnChange;
const height = props.height ?? "405";
const className = props.className ?? "w-100";
const embedCss = props.embedCss || "";

State.init({
  iframeHeight: height,
  message: { handler: "init", content: props.data }
});

// SIMPLEMDE CONFIG //
const fontFamily = props.fontFamily ?? "sans-serif";
const alignToolItems = props.alignToolItems ?? "right";
const autoFocus = props.autoFocus ?? true;
const renderingConfig = JSON.stringify(
  props.renderingConfig ?? {
    singleLineBreaks: false,
    codeSyntaxHighlighting: true
  }
);
const placeholder = props.placeholder ?? "";
const statusConfig = JSON.stringify(
  props.statusConfig ?? ["lines", "words", "cursor"]
);
const spellChecker = props.spellChecker ?? true;
const tabSize = props.tabSize ?? 4;

// Add or remove toolbar items
// For adding unique items, configure the switch-case within the iframe
const toolbarConfig = JSON.stringify(
  props.toolbar ?? [
    "heading",
    "bold",
    "italic",
    "|", // adding | creates a divider in the toolbar
    "quote",
    "code",
    "link",
    "image",
    "mention",
    "reference",
    "unordered-list",
    "ordered-list",
    "checklist",
    "table",
    "horizontal-rule",
    "guide",
    "preview"
  ]
);

const code = `
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
    <script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>
    <script src="https://cdn.jsdelivr.net/highlight.js/latest/highlight.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/highlight.js/latest/styles/github.min.css">
    <style>
    body {  
        margin: auto;
        font-family: ${fontFamily};
        overflow: visible;
    }
    
    .editor-toolbar {
        text-align: ${alignToolItems};
    }
    ${embedCss}
    </style>
    <div id="react-root"></div>
    
    <script>
    let codeMirrorInstance;
    let isEditorInitialized = false;
    
    function MarkdownEditor(props) {
        const [value, setValue] = React.useState(props.initialText || "");
    
        React.useEffect(() => {
            const generateToolbarItems = () => {
                return ${toolbarConfig}.map((item) => {
                    switch(item) {
                        // CONFIGURE CUSTOM IMPLEMENTATIONS HERE
                        case "checklist": {
                            function handleChecklist(editor) {
                                const cursorPos = editor.codemirror.getCursor();
                                const lineText = editor.codemirror.getLine(cursorPos.line);
                                if (lineText.trim() === "") {
                                    editor.codemirror.replaceRange(" - [ ] ", cursorPos);
                                } else {
                                    editor.codemirror.replaceRange("\\n - [ ] ", cursorPos);
                                }
                            }
                            return {
                                name: "checklist",
                                action: handleChecklist,
                                className: "fa fa-check-square",
                                title: "Insert Checklist"
                            }
                        }
                        case "mention": {
                            function handleMention(editor) {
                                const cursorPos = editor.codemirror.getCursor();
                                editor.codemirror.replaceRange("@", cursorPos);
                            }
                            return {
                                name: "mention",
                                action: handleMention,
                                className: "fa fa-at",
                                title: "Insert Mention"
                            }
                        }
                        case "reference": {
                            function handleReference(editor) {
                                const cursorPos = editor.codemirror.getCursor();
                                editor.codemirror.replaceRange("bos://", cursorPos);
                            }
                            return {
                                name: "reference",
                                action: handleReference,
                                className: "fa fa-external-link-square",
                                title: "Reference Thing"
                            }
                        }
                        case "image": {
                            // TODO: convert to upload to IPFS
                            return {
                                name: "image",
                                action: SimpleMDE.drawImage,
                                className: "fa fa-picture-o",
                                title: "Insert Image"
                            }
                        }
                        default: {
                            return item;
                        }
                    }
                });
            };
    
            function renderPreview(plainText, preview) {
                // TODO: can we place custom preview element? Perhaps install VM into this iframe?
                setTimeout(function(){
                        preview.innerHTML = "<p>hello</p>";
                    }, 250);
                return "loading";
            }
            
            // Initializes SimpleMDE element and attaches to text-area
            const simplemde = new SimpleMDE({
                element: document.getElementById("markdown-input"),
                forceSync: true,
                autofocus: ${autoFocus},
                renderingConfig: ${renderingConfig},
                placeholder: "${placeholder}",
                status: ${statusConfig},
                spellChecker: ${spellChecker},
                tabSize: ${tabSize},
                toolbar: generateToolbarItems(),
                initialValue: value,
                previewRender: renderPreview,
                insertTexts: {
                  image: ["![](https://", ")"],
                  link: ["[", "](https://)"],
                },
            });
    
            codeMirrorInstance = simplemde.codemirror;
    
            /**
             * Sends message to Widget to update content
             */
            const updateContent = () => {
                const content = simplemde.value();
                window.parent.postMessage({ handler: "update", content }, "*");
            };
    
            /**
             * Sends message to Widget to update iframe height
             */
            const updateIframeHeight = () => {
                const iframeHeight = document.body.scrollHeight;
                window.parent.postMessage({ handler: "resize", height: iframeHeight }, "*");
            };
    
            // On Change
            simplemde.codemirror.on('change', () => {
                updateContent();
                updateIframeHeight();
            });
        }, []);
    
        return React.createElement('textarea', { id: 'markdown-input', value: value, onChange: setValue });
    }
    
    const domContainer = document.querySelector('#react-root');
    const root = ReactDOM.createRoot(domContainer);
    
    window.addEventListener("message", (event) => {
      if (!isEditorInitialized && event.data !== "") {
        root.render(React.createElement(MarkdownEditor, {
            initialText: event.data.content }));
            isEditorInitialized = true;
      } else {
        if (event.data.handler === 'autocompleteSelected') {
            codeMirrorInstance.getDoc().setValue(event.data.content);
          }
      }
    });
    </script>
    `;
return (
  <iframe
    className={className}
    style={{
      height: `${state.iframeHeight}px`
    }}
    srcDoc={code}
    message={data ?? { content: "" }}
    onMessage={(e) => {
      switch (e.handler) {
        case "update": {
          onChange(e.content);
        }
        case "resize": {
          const offset = 0;
          if (statusConfig.length) {
            offset = 10;
          }
          State.update({ iframeHeight: e.height + offset });
        }
      }
    }}
  />
);
