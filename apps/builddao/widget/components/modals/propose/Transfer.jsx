const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};
const DaoSDK = VM.require("sdks.near/widget/SDKs.Sputnik.DaoSDK") || (() => {});

if (!DaoSDK) {
  return <></>;
}

const [recipient, setRecipient] = useState("");
const [token, setToken] = useState("");
const [amount, setAmount] = useState(0);
const [description, setDescription] = useState("");
const [validatedAddresss, setValidatedAddress] = useState(true);

const bootstrapTheme = props.bootstrapTheme;

const [text, setText] = useState("");
const [editorKey, setEditorKey] = useState(0);
useEffect(() => {
  if (!props.item) {
    return;
  }
  const { path, blockHeight } = props.item;
  setText(`[EMBED](${path}@${blockHeight})`);
  setEditorKey((editorKey) => editorKey + 1);
}, [props.item]);
const memoizedKey = useMemo((editorKey) => editorKey, [editorKey]);
const selectedDAO = props.selectedDAO;
const sdk = DaoSDK(selectedDAO);

const res = fetch(`https://api.nearblocks.io/v1/account/${selectedDAO}/tokens`);
const NearTokenId = "NEAR";
const tokensData = [
  {
    decimals: 24,
    icon: "",
    name: "NEAR",
    symbol: "NEAR",
    tokenId: NearTokenId,
  },
];
if (res.body) {
  res.body?.tokens?.fts.map((item) => {
    const ftMetadata = Near.view(item, "ft_metadata", {});
    if (ftMetadata === null) {
      return;
    }
    tokensData.push({ ...ftMetadata, tokenId: item });
  });
}

// handle checking
const regex = /.{1}\.near$/;
useEffect(() => {
  if (regex.test(recipient) || recipient === "") {
    setValidatedAddress(true);
  } else {
    setValidatedAddress(false);
  }
}, [recipient]);

useEffect(() => {
  if (amount < 0) {
    setAmount(0);
  }
}, [amount]);

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
      <label htmlFor="recipient">
        Recipient<span className="text-danger">*</span>
      </label>
      <input
        className="form-control"
        name="recipient"
        id="recipient"
        placeholder="NEAR Address"
        value={recipient}
        data-bs-theme={bootstrapTheme}
        onChange={(e) => setRecipient(e.target.value)}
      />
      {!validatedAddresss && (
        <span className="text-danger" style={{ fontSize: 12 }}>
          Please check if the NEAR address is valid!
        </span>
      )}
    </div>
    <div className="form-group mb-3">
      <label htmlFor="token">
        Token<span className="text-danger">*</span>
      </label>
      <select
        class="form-select"
        name="token"
        id="token"
        value={token}
        data-bs-theme={bootstrapTheme}
        onChange={(e) => setToken(e.target.value)}
      >
        <option value="">Select a token</option>
        {tokensData?.map((item) => {
          return <option value={item.tokenId}>{item.symbol}</option>;
        })}
      </select>
    </div>
    <div className="form-group mb-3">
      <label htmlFor="amount">
        Amount<span className="text-danger">*</span>
      </label>
      <input
        className="form-control"
        name="amount"
        id="amount"
        type="number"
        value={amount}
        data-bs-theme={bootstrapTheme}
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
            embedCss: props.customCSS || MarkdownEditor,
            onChange: (v) => {
              setText(v);
            },
          }}
        />
      </TextareaWrapper>
    </div>
    <div className="w-100 d-flex">
      <Button
        disabled={!token || !recipient || !amount || !validatedAddresss}
        className="ms-auto"
        variant="primary"
        onClick={() => {
          let ftMetadata = tokensData.find((item) => item.tokenId === token);
          const amountInYocto = Big(amount)
            .mul(Big(10).pow(ftMetadata.decimals))
            .toFixed();
          sdk.createTransferProposal({
            description: text,
            tokenId: token === NearTokenId ? "" : token,
            receiverId: recipient,
            amount: amountInYocto,
            gas,
            deposit,
            gas: 180000000000000,
            deposit: 200000000000000,
          });
        }}
      >
        Next
      </Button>
    </div>
  </div>
);
