const { Button } =
  VM.require("buildhub.near/widget/components") || (() => <></>);

const [recipient, setRecipient] = useState("");
const [token, setToken] = useState("");
const [amount, setAmount] = useState(0);
const [description, setDescription] = useState("");

const [text, setText] = useState("");
const [editorKey, setEditorKey] = useState(0);
useEffect(() => {
  const { path, blockHeight } = props.item;
  setText(`[EMBED](${path}@${blockHeight})`);
  setEditorKey((editorKey) => editorKey + 1);
}, [props.item]);
const memoizedKey = useMemo((editorKey) => editorKey, [editorKey]);
const selectedDao = props.selectedDao;

const MarkdownEditor = `
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
    top: -110px !important;
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

const TextareaWrapper = styled.div`
  display: grid;
  vertical-align: top;
  align-items: center;
  position: relative;
  align-items: stretch;
  width: 100%;

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

return (
  <div className="d-flex flex-column">
    <div className="form-group mb-3">
      <label htmlFor="recipient">Recipient</label>
      <input
        className="form-control"
        name="recipient"
        id="recipient"
        value={recipient}
        data-bs-theme="dark"
        onChange={(e) => setRecipient(e.target.value)}
      />
    </div>
    <div className="form-group mb-3">
      <label htmlFor="token">Token</label>
      <select
        class="form-select"
        name="token"
        id="token"
        value={token}
        data-bs-theme="dark"
        onChange={(e) => setToken(e.target.value)}
      >
        <option>Select a token</option>
        <option value="near">NEAR</option>
        <option value="eth">ETH</option>
        <option value="usdc">USDC</option>
        <option value="usdt">USDT</option>
        <option value="aurora">AURORA</option>
      </select>
    </div>
    <div className="form-group mb-3">
      <label htmlFor="amount">Amount</label>
      <input
        className="form-control"
        name="amount"
        id="amount"
        type="number"
        value={amount}
        data-bs-theme="dark"
        onChange={(e) => setAmount(e.target.value)}
      />
    </div>
    <div className="form-group mb-3">
      <label>Proposal Description</label>
      <TextareaWrapper
        className="markdown-editor mb-3"
        data-value={text || ""}
        key={memoizedKey}
      >
        <Widget
          src="mob.near/widget/MarkdownEditorIframe"
          props={{
            initialText: text,
            embedCss: MarkdownEditor,
            onChange: (v) => {
              setText(v);
            },
          }}
        />
      </TextareaWrapper>
    </div>
    <div className="w-100 d-flex">
      <Button
        disabled={!token || !recipient || !amount}
        className="ms-auto"
        variant="primary"
        onClick={() =>
          Near.call(selectedDAO, "add_proposal", {
            proposal: {
              description: text,
              kind: {
                Transfer: {
                  token_id: token,
                  reciever_id: recipient,
                  amount: amount,
                },
              },
            },
          })
        }
      >
        Next
      </Button>
    </div>
  </div>
);
