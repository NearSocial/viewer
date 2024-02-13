const { User, Button } = VM.require("buildhub.near/widget/components") || {
  User: () => <></>,
  Button: () => <></>
};

const draftKey = props.draftKey || "draft";
const draft = Storage.privateGet(draftKey);
const postBtnText = props.postBtnText;
if (draft === null) {
  return "";
}

const autocompleteEnabled = true;

State.init({
  image: {}
});

const [view, setView] = useState("editor");
const [postContent, setPostContent] = useState("");
const [hideAdvanced, setHideAdvanced] = useState(true);
const [showAccountAutocomplete, setShowAccountAutocomplete] = useState(false);
const [mentionsArray, setMentionsArray] = useState([]);
const [mentionInput, setMentionInput] = useState(null);
const [handler, setHandler] = useState("update");
const [showToast, setShowToast] = useState(false);

const [composeKey, setComposeKey] = useState(0);
const memoizedComposeKey = useMemo(() => composeKey, [composeKey]);

function generateUID() {
  const maxHex = 0xffffffff;
  const randomNumber = Math.floor(Math.random() * maxHex);
  return randomNumber.toString(16).padStart(8, "0");
}

setPostContent(draft || props.template);

const extractMentions = (text) => {
  const mentionRegex =
    /@((?:(?:[a-z\d]+[-_])*[a-z\d]+\.)*(?:[a-z\d]+[-_])*[a-z\d]+)/gi;
  mentionRegex.lastIndex = 0;
  const accountIds = new Set();
  for (const match of text.matchAll(mentionRegex)) {
    if (
      !/[\w`]/.test(match.input.charAt(match.index - 1)) &&
      !/[/\w`]/.test(match.input.charAt(match.index + match[0].length)) &&
      match[1].length >= 2 &&
      match[1].length <= 64
    ) {
      accountIds.add(match[1].toLowerCase());
    }
  }
  return [...accountIds];
};

const extractHashtags = (text) => {
  const hashtagRegex = /#(\w+)/gi;
  hashtagRegex.lastIndex = 0;
  const hashtags = new Set();
  for (const match of text.matchAll(hashtagRegex)) {
    if (
      !/[\w`]/.test(match.input.charAt(match.index - 1)) &&
      !/[/\w`]/.test(match.input.charAt(match.index + match[0].length))
    ) {
      hashtags.add(match[1].toLowerCase());
    }
  }
  return [...hashtags];
};

const extractMentionNotifications = (text, item) =>
  extractMentions(text || "")
    .filter((accountId) => accountId !== context.accountId)
    .map((accountId) => ({
      key: accountId,
      value: {
        type: "mention",
        item
      }
    }));

function checkAndAppendHashtag(input, target) {
  if (input.toLowerCase().includes(`#${target.toLowerCase()}`)) {
    return input;
  } else {
    return input + ` #${target}`;
  }
}

const content = {
  type: "md",
  image: state.image.cid ? { ipfs_cid: state.image.cid } : undefined,
  text: postContent
};

const postToCustomFeed = ({ feed, text }) => {
  const requiredHashtags = props.requiredHashtags || ["build"];
  if (feed.hashtag) requiredHashtags.push(feed.hashtag.toLowerCase());
  text = text + `\n\n`;
  requiredHashtags.forEach((hashtag) => {
    text = checkAndAppendHashtag(text, hashtag);
  });

  const data = {
    post: {
      main: JSON.stringify(content)
    },
    index: {
      post: JSON.stringify({ key: "main", value: { type: "md" } })
    }
  };

  const item = {
    type: "social",
    path: `${context.accountId}/post/main`
  };

  const notifications = extractMentionNotifications(text, item);

  if (notifications.length) {
    data.index.notify = JSON.stringify(
      notifications.length > 1 ? notifications : notifications[0]
    );
  }

  const hashtags = extractHashtags(text);

  if (hashtags.length) {
    data.index.hashtag = JSON.stringify(
      hashtags.map((hashtag) => ({
        key: hashtag,
        value: item
      }))
    );
  }

  return Social.set(data, {
    force: true,
    onCommit: () => {
      setPostContent("");
      Storage.privateSet(draftKey, props.template || "");
      setComposeKey(generateUID());
      setHandler("autocompleteSelected"); // this is a hack to force the iframe to update
      setShowToast(true);
    },
    onCancel: () => {
      // console.log(`Cancelled ${feed}: #${postId}`);
    }
  });
};

function textareaInputHandler(value) {
  const words = value.split(/\s+/);
  const allMentiones = words
    .filter((word) => word.startsWith("@"))
    .map((mention) => mention.slice(1));
  const newMentiones = allMentiones.filter(
    (item) => !mentionsArray.includes(item)
  );
  setMentionInput(newMentiones?.[0] ?? "");
  setMentionsArray(allMentiones);
  setShowAccountAutocomplete(newMentiones?.length > 0);
  setPostContent(value);
  setHandler("update");
  Storage.privateSet(draftKey, value || "");
}

function autoCompleteAccountId(id) {
  let currentIndex = 0;
  const updatedDescription = postContent.replace(
    /(?:^|\s)(@[^\s]*)/g,
    (match) => {
      if (currentIndex === mentionsArray.indexOf(mentionInput)) {
        currentIndex++;
        return ` @${id}`;
      } else {
        currentIndex++;
        return match;
      }
    }
  );
  setPostContent(updatedDescription);
  setShowAccountAutocomplete(false);
  setMentionInput(null);
  setHandler("autocompleteSelected");
  Storage.privateSet(draftKey, updatedDescription || "");
}

const PostCreator = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  padding: 1rem;
  background: var(--compose-bg, #23242b);
  border: 1px solid var(--stroke-color, rgba(255, 255, 255, 0.2));
  border-radius: 12px;

  margin-bottom: 1rem;

  .upload-image-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f3f5;
    color: #11181c;
    border-radius: 40px;
    height: 40px;
    min-width: 40px;
    font-size: 0;
    border: none;
    cursor: pointer;
    transition: background 200ms, opacity 200ms;
    &::before {
      font-size: 16px;
    }
    &:hover,
    &:focus {
      background: #d7dbde;
      outline: none;
    }
    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }
    span {
      margin-left: 12px;
    }
  }
  .d-inline-block {
    display: flex !important;
    gap: 12px;
    margin: 0 !important;
    .overflow-hidden {
      width: 40px !important;
      height: 40px !important;
    }
  }
`;

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

const MarkdownPreview = styled.div`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 16px !important;
  }
  @media (max-width: 767px) {
    font-size: 15px !important;
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      font-size: 15px !important;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  strong,
  b {
    font-weight: 500 !important;
  }
  ol,
  ul,
  dl {
    margin-bottom: 0.5rem;
    white-space: inherit;
  }
  p {
    margin-bottom: 0.5rem;
  }
  hr {
    display: none;
  }
  img {
    border-radius: var(--bs-border-radius-lg);
    max-height: 40em;
  }
  th {
    min-width: 5em;
  }

  .table > :not(caption) > * > * {
    padding: 0.3rem;
  }

  * {
    color: #b6b6b8 !important;
  }

  a {
    color: #0d6efd !important;

    &:hover {
      color: #0a58ca !important;
    }
  }
`;

const avatarComponent = useMemo(() => {
  return <User accountId={context.accountId} />;
}, [context.accountId]);

return (
  <PostCreator>
    {avatarComponent}
    <div style={{ border: "none" }}>
      {view === "editor" ? (
        <TextareaWrapper
          className="markdown-editor"
          data-value={postContent || ""}
          key={memoizedComposeKey}
        >
          <Widget
            src={"buildhub.near/widget/components.MarkdownEditorIframe"}
            props={{
              initialText: postContent,
              data: { handler: handler, content: postContent },
              embedCss: props.customCSS || MarkdownEditor,
              onChange: (v) => {
                textareaInputHandler(v);
              }
            }}
          />
          {autocompleteEnabled && showAccountAutocomplete && (
            <Widget
              src="buildhub.near/widget/components.AccountAutocomplete"
              props={{
                term: mentionInput,
                onSelect: autoCompleteAccountId,
                onClose: () => setShowAccountAutocomplete(false)
              }}
            />
          )}
        </TextareaWrapper>
      ) : (
        <MarkdownPreview>
          <Widget
            src="devhub.near/widget/devhub.components.molecule.MarkdownViewer"
            props={{ text: postContent }}
          />
          {state.image.cid && (
            <Widget
              src="mob.near/widget/Image"
              props={{
                image: state.image.cid
                  ? { ipfs_cid: state.image.cid }
                  : undefined
              }}
            />
          )}
        </MarkdownPreview>
      )}
    </div>

    <div className="d-flex gap-3 align-self-end">
      {view === "editor" && (
        <IpfsImageUpload
          image={state.image}
          className="upload-image-button bi bi-image"
        />
      )}
      <Button
        variant="outline"
        onClick={() => setView(view === "editor" ? "preview" : "editor")}
        style={{ fontSize: 14 }}
      >
        {view === "editor" ? (
          <>
            Preview <i className="bi bi-eye"></i>
          </>
        ) : (
          <>
            Edit <i className="bi bi-pencil-square"></i>
          </>
        )}
      </Button>
      <Button
        variant="primary"
        style={{ fontSize: 14 }}
        onClick={() =>
          postToCustomFeed({
            feed: props.feed,
            text: postContent
          })
        }
      >
        {postBtnText ?? "Post"}
      </Button>
    </div>
    <Widget
      src="near/widget/DIG.Toast"
      props={{
        title: "Post Submitted Successfully",
        type: "success",
        open: showToast,
        onOpenChange: (v) => setShowToast(v),
        trigger: <></>,
        action: (
          <Button
            variant="primary"
            style={{ fontSize: 14 }}
            onClick={() => setShowToast(false)}
          >
            dismiss
          </Button>
        ),
        providerProps: { duration: 1000 }
      }}
    />
  </PostCreator>
);
