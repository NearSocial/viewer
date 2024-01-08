const draftKey = props.feed.name || "draft";
const draft = Storage.privateGet(draftKey);

if (draft === null) {
  return "";
}

const [view, setView] = useState("editor");
const [postContent, setPostContent] = useState("");
const [hideAdvanced, setHideAdvanced] = useState(true);
const [labels, setLabels] = useState([]);

setPostContent(draft || props.template);

function generateUID() {
  const maxHex = 0xffffffff;
  const randomNumber = Math.floor(Math.random() * maxHex);
  return randomNumber.toString(16).padStart(8, "0");
}

function tagsFromLabels(labels) {
  return labels.reduce(
    (newLabels, label) => ({
      ...newLabels,
      [label]: "",
    }),
    {}
  );
}

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
        item,
      },
    }));

function checkAndAppendHashtag(input, target) {
  if (input.toLowerCase().includes(`#${target.toLowerCase()}`)) {
    return input;
  } else {
    return input + ` #${target}`;
  }
}

const postToCustomFeed = ({ feed, text, labels }) => {
  const postId = generateUID();
  if (!labels) labels = [];

  labels = labels.map((label) => label.toLowerCase());
  labels.push(feed.name.toLowerCase());

  const requiredHashtags = ["build"];
  if (feed.hashtag) requiredHashtags.push(feed.hashtag.toLowerCase());
  requiredHashtags.push(feed.name.toLowerCase());

  text = text + `\n\n`;

  requiredHashtags.forEach((hashtag) => {
    text = checkAndAppendHashtag(text, hashtag);
  });

  const data = {
    // [feed.name]: {
    //   [postId]: {
    //     "": JSON.stringify({
    //       type: "md",
    //       text,
    //       labels,
    //     }),
    //     metadata: {
    //       type: feed.name,
    //       tags: tagsFromLabels(labels),
    //     },
    //   },
    // },
    post: {
      main: JSON.stringify({
        type: "md",
        text,
        // tags: tagsFromLabels(labels),
        // postType: feed.name,
      }),
    },
    index: {
      post: JSON.stringify({ key: "main", value: { type: "md" } }),
      // every: JSON.stringify({ key: feed.name, value: { type: "md" } }),
    },
  };

  const item = {
    type: "social",
    path: `${context.accountId}/post/main`,
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
        value: item,
      }))
    );
  }

  return Social.set(data, {
    force: true,
    onCommit: () => {
      // console.log(`Commited ${feed}: #${postId}`);
    },
    onCancel: () => {
      // console.log(`Cancelled ${feed}: #${postId}`);
    },
  });
};

const PostCreator = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  padding: 1rem;
  background: #23242b;
  border-radius: 12px;

  margin-bottom: 1rem;
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
  * {
    border: none !important;
  }

  .rc-md-editor {
    background: #4f5055;
    border-top: 1px solid #4f5055 !important; 
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
  }

  .rc-md-navigation {
    background: #23242b !important;
    border: 1px solid #4f5055 !important;
    border-top: 0 !important;
    border-bottom: 0 !important;
  
    i {
      color: #cdd0d5;
    }
  }

  .rc-md-editor .editor-container .sec-md .input {
    overflow-y: auto;
    padding: 8px !important;
    line-height: normal;
  }
`;

const Button = styled.button`
  all: unset;
  display: flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 4px;

  border-radius: 8px;
  background: var(--Yellow, #ffaf51);

  color: var(--black-100, #000);

  /* Other/Button_text */
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const SecondaryButton = styled.button`
  all: unset;
  display: flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 4px;

  border-radius: 8px;
  border: 1px solid var(--white-100, #fff);
  background: transparent;
  color: var(--white-100, #fff);

  /* Other/Button_text */
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  transition: all 300ms;

  &:hover {
    background: #fff;
    color: #000;
  }
`;

const MarkdownPreview = styled.div`
  * {
    color: #b6b6b8 !important;
  }
`;

const LabelSelect = styled.div`
  label {
    color: #fff;
  }

  .rbt-input-multi {
    background: #23242b !important;
    color: #fff !important;
  }

  .rbt-token {
    background: #202020 !important;
    color: #fff !important;
  }

  .rbt-menu {
    background: #23242b !important;
    color: #fff !important;

    .dropdown-item {
      color: #fff !important;
      transition: all 300ms;

      &:hover {
        background: #202020;
      }
    }
  }
`;

return (
  <PostCreator>
    <div className="d-flex gap-3">
      <Widget
        src="mob.near/widget/ProfileImage"
        props={{
          accountId: context.accountId,
          tooltip: false,
          link: true,
          style: imgWrapperStyle,
          imageClassName: "rounded-circle w-100 h-100",
        }}
      />
      <div
        className="d-flex flex-column"
        style={{ color: "white", fontSize: 16 }}
      >
        <p className="fw-bold m-0">{name}</p>
        <p className="m-0">@{context.accountId}</p>
      </div>
    </div>

    <div style={{ border: "none" }}>
      {view === "editor" ? (
        <TextareaWrapper
          className="markdown-editor"
          data-value={postContent || ""}
          key={props.feed.name}
        >
          <Widget
            src="mob.near/widget/MarkdownEditorIframe"
            props={{
              initialText: postContent,
              embedCss: MarkdownEditor,
              onChange: (v) => {
                setPostContent(v);
                Storage.privateSet(draftKey, v || "");
              },
            }}
          />
        </TextareaWrapper>
      ) : (
        <MarkdownPreview>
          <Widget
            src="devhub.near/widget/devhub.components.molecule.MarkdownViewer"
            props={{ text: postContent }}
          />
        </MarkdownPreview>
      )}
    </div>

    {/* {view === "editor" && (
      <div style={{ color: "white" }}>
        <div
          className="d-flex justify-content-between align-items-center"
          onClick={() => setHideAdvanced(!hideAdvanced)}
          style={{ cursor: "pointer" }}
        >
          <h6 className="fw-bold">Advanced</h6>
          <i className={`bi bi-chevron-${hideAdvanced ? "up" : "down"}`}></i>
        </div>

        <LabelSelect
          className={`d-${hideAdvanced ? "none" : "flex"} flex-column mt-3`}
        >
          <Widget
            src="discover.near/widget/Inputs.MultiSelect"
            props={{
              label: "Labels",
              placeholder: "Near.social, Widget, NEP, Standard, Protocol, Tool",
              options: [
                "Near.social",
                "Widget",
                "NEP",
                "Standard",
                "Protocol",
                "Tool",
              ],
              labelKey: "labels",
              value: labels,
              onChange: setLabels,
            }}
          />
        </LabelSelect>
      </div>
    )} */}

    <div className="d-flex gap-3 align-self-end">
      <SecondaryButton
        onClick={() => setView(view === "editor" ? "preview" : "editor")}
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
      </SecondaryButton>
      <Button
        onClick={() =>
          postToCustomFeed({ feed: props.feed, text: postContent, labels })
        }
      >
        Post {props.feed.name}
      </Button>
    </div>
  </PostCreator>
);
