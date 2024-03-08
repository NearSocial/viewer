const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

const item = props.item;
const content = props.content;
const closeModal = props.closeModal;

const TextareaWrapper = styled.div`
  display: grid;
  vertical-align: top;
  align-items: center;
  position: relative;
  align-items: stretch;

  textarea {
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
  }

  textarea::placeholder {
    padding-top: 4px;
    font-size: 20px;
  }

  textarea:focus::placeholder {
    font-size: inherit;
    padding-top: 0px;
  }

  &::after,
  textarea,
  iframe {
    width: 100%;
    padding: 8px 0;
    min-width: 1em;
    height: unset;
    min-height: 3em;
    font: inherit;
    margin: 0;
    resize: none;
    background: none;
    appearance: none;
    border: 0px solid #eee;
    grid-area: 1 / 1;
    overflow: hidden;
    outline: none;
  }

  iframe {
    padding: 0;
  }

  textarea:focus,
  textarea:not(:empty) {
    border-bottom: 1px solid #eee;
    min-height: 5em;
  }

  &::after {
    content: attr(data-value) " ";
    visibility: hidden;
    white-space: pre-wrap;
  }
  &.markdown-editor::after {
    padding-top: 66px;
    font-family: monospace;
    font-size: 14px;
  }
`;

const Wrapper = styled.div`
  line-height: normal;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;

  .right {
    flex-grow: 1;
    min-width: 0;
  }

  .up-buttons {
    margin-top: 12px;

    @media screen and (max-width: 768px) {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }
`;

const embedCss = `
.rc-md-editor {
  border: 0;
}
.rc-md-editor .editor-container>.section {
  border: 0;
}
.rc-md-editor .editor-container .sec-md .input {
  overflow-y: auto;
  padding: 8px 0 !important;
  line-height: normal;
}

html {
  background: #23242b;
}

* {
  border: none !important;
}

.rc-md-editor {
  background: #4f5055;
  border-top: 1px solid #4f5055 !important;
  border-radius: 8px;
}

.editor-container {
  background: #4f5055;
}

.drop-wrap {
  
  border-radius: 0.5rem !important;
}

.header-list {
  display: flex;
  align-items: center;
}

textarea {
  background: #23242b !important;
  color: #fff !important;

  font-family: sans-serif !important;
  font-size: 1rem;

  border: 1px solid #4f5055 !important;
  border-top: 0 !important;
  border-radius: 0 0 8px 8px;
}

.rc-md-navigation {
  background: #23242b !important;
  border: 1px solid #4f5055 !important;
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-radius: 8px 8px 0 0;

  i {
    color: #cdd0d5;
  }
}

.editor-container {
  border-radius: 0 0 8px 8px;
}

.rc-md-editor .editor-container .sec-md .input {
  overflow-y: auto;
  padding: 8px !important;
  line-height: normal;
  border-radius: 0 0 8px 8px;
}
`;

State.init({
  text: content.text || "",
});

const onChange = (text) => {
  State.update({ text });
};

const handleEdit = () => {
  Social.set({
    index: {
      modify: JSON.stringify({
        key: item,
        value: {
          type: "edit",
          value: {
            text: state.text,
          },
        },
      }),
    },
  });
};

return (
  <>
    <div className="mb-3">
      <label>Content</label>
      <TextareaWrapper
        className={markdownEditor ? "markdown-editor" : ""}
        data-value={state.text || ""}
      >
        <Widget
          key={`markdown-editor-${markdownEditor}-${memoizedEditorKey}`}
          src="mob.near/widget/MarkdownEditorIframe"
          props={{
            initialText: state.text,
            onChange,
            embedCss,
          }}
        />
        {autocompleteEnabled && state.showAccountAutocomplete && (
          <div className="pt-1 w-100 overflow-hidden">
            <Widget
              src="devs.near/widget/Common.AccountAutocomplete"
              props={{
                term: state.text.split("@").pop(),
                onSelect: autoCompleteAccountId,
                onClose: () => State.update({ showAccountAutocomplete: false }),
              }}
            />
          </div>
        )}
      </TextareaWrapper>
    </div>
    <div className="d-flex align-items-center justify-content-end gap-3">
      <Button variant="outline" onClick={closeModal}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleEdit}>
        Edit Post
      </Button>
    </div>
  </>
);
