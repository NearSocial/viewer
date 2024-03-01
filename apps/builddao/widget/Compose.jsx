const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

if (!context.accountId) {
  return "";
}

const indexKey = props.indexKey ?? "main";
const draftKey = props.draftKey ?? "draft";
const template = props.template || "";
const feed = props.feed;
const draft = Storage.privateGet(draftKey);
const groupId = props.groupId;

if (draft === null) {
  return "";
}

const [initialText] = useState(draft || template);

function checkAndAppendHashtag(input, target) {
  if (input.toLowerCase().includes(`#${target.toLowerCase()}`)) {
    return input;
  } else {
    return input + ` #${target}`;
  }
}

const composeData = () => {
  const text = state.content.text;

  const requiredHashtags = props.requiredHashtags || ["build"];
  if (feed.hashtag) requiredHashtags.push(feed.hashtag.toLowerCase());
  text = text + `\n\n`;
  requiredHashtags.forEach((hashtag) => {
    text = checkAndAppendHashtag(text, hashtag);
  });

  const data = {
    post: {
      main: JSON.stringify({ ...state.content, text }),
    },
    index: {
      post: JSON.stringify({
        key: indexKey,
        value: {
          type: "md",
        },
      }),
    },
  };

  const item = {
    type: "social",
    path: `${context.accountId}/post/main`,
  };

  const notifications = state.extractMentionNotifications(text, item);

  if (notifications.length) {
    data.index.notify = JSON.stringify(
      notifications.length > 1 ? notifications : notifications[0],
    );
  }

  const hashtags = state.extractHashtags(text);

  if (hashtags.length) {
    data.index.hashtag = JSON.stringify(
      hashtags.map((hashtag) => ({
        key: hashtag,
        value: item,
      })),
    );
  }

  return data;
};

State.init({
  showPreview: false,
  posted: false,
  onChange: ({ content }) => {
    State.update({ content });
    Storage.privateSet(draftKey, content.text || "");
  },
});

const [showToast, setShowToast] = useState(false);

return (
  <>
    <div
      data-bs-theme="dark"
      style={{
        background: "var(--bg-2, #2b2f31)",
        borderRadius: "1rem",
        border: "1px solid var(--stroke-color, rgba(255, 255, 255, 0.2)",
        marginBottom: "1rem",
      }}
    >
      <div>
        <Widget
          src="devs.near/widget/Common.Compose"
          props={{
            placeholder: "What's happening?",
            onChange: state.onChange,
            initialText,
            onHelper: ({ extractMentionNotifications, extractHashtags }) => {
              State.update({ extractMentionNotifications, extractHashtags });
            },
            composeButton: (onCompose) => (
              <CommitButton
                disabled={!state.content || state.content.text === template}
                force
                className="btn rounded-3"
                style={{
                  backgroundColor: "var(--yellow, #eca227)",
                  color: "var(--button-primary-color, #000)",
                  fontSize: "14px",
                  fontWeight: "500",
                  padding: "10px 16px",
                }}
                data={composeData}
                onCommit={() => {
                  onCompose();
                  setShowToast(true);
                  State.update({ content: { text: "", image: {} } });
                }}
              >
                Post
              </CommitButton>
            ),
            previewButton: () => (
              <button
                disabled={!state.content || state.content.text === template}
                className="btn rounded-3 me-2"
                style={{
                  backgroundColor: "var(--button-outline-bg, transparent)",
                  color: "var(--button-outline-color, #fff)",
                  border:
                    "1px solid var(--stroke-color, rgba(255, 255, 255, 0.2)",
                  fontSize: "14px",
                  fontWeight: "500",
                  padding: "10px 16px",
                }}
                onClick={() =>
                  State.update({ showPreview: !state.showPreview })
                }
              >
                Preview <i className="bi bi-eye"></i>
              </button>
            ),
          }}
        />
      </div>
      {state.content && state.showPreview && (
        <div className="px-3">
          <Widget
            key="post-preview"
            src="buildhub.near/widget/components.Post"
            props={{
              accountId: context.accountId,
              content: state.content || { type: "md", text: "" },
              blockHeight: "now",
              noBorder: true,
            }}
          />
        </div>
      )}
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
        providerProps: { duration: 1000 },
      }}
    />
  </>
);
