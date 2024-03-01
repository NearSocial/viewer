if (!context.accountId) {
  return "";
}

const item = props.item;
const rootItem = props.rootItem;

if (!context.accountId) {
  return "";
}

const composeData = () => {
  const data = {
    post: {
      comment: JSON.stringify(Object.assign({ item, rootItem }, state.content)),
    },
    index: {
      comment: JSON.stringify({
        key: item,
        value: {
          type: "md",
        },
      }),
    },
  };

  const thisItem = {
    type: "social",
    path: `${context.accountId}/post/comment`,
  };

  const notifications = state.extractMentionNotifications(
    state.content.text,
    thisItem,
  );

  if (props.notifyAccountId && props.notifyAccountId !== context.accountId) {
    notifications.push({
      key: props.notifyAccountId,
      value: {
        type: "comment",
        item,
      },
    });
  }

  if (notifications.length) {
    data.index.notify = JSON.stringify(
      notifications.length > 1 ? notifications : notifications[0],
    );
  }

  const hashtags = state.extractHashtags(state.content.text);

  if (hashtags.length) {
    data.index.hashtag = JSON.stringify(
      hashtags.map((hashtag) => ({
        key: hashtag,
        value: thisItem,
      })),
    );
  }

  return data;
};

State.init({
  onChange: ({ content }) => {
    State.update({ content });
  },
});

return (
  <>
    <Widget
      src="devs.near/widget/Common.Compose"
      props={{
        placeholder: "Reply",
        initialText: props.initialText,
        onChange: state.onChange,
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
              props.onComment && props.onComment(state.content);
            }}
          >
            Comment
          </CommitButton>
        ),
        previewButton: () => (
          <button
            disabled={!state.content}
            className="btn rounded-3 me-2"
            style={{
              backgroundColor: "var(--button-outline-bg, transparent)",
              color: "var(--button-outline-color, #fff)",
              border: "1px solid var(--stroke-color, rgba(255, 255, 255, 0.2)",
              fontSize: "14px",
              fontWeight: "500",
              padding: "10px 16px",
            }}
            onClick={() => State.update({ showPreview: !state.showPreview })}
          >
            Preview <i className="bi bi-eye"></i>
          </button>
        ),
      }}
    />
    {state.content && state.showPreview && (
      <div className="px-3">
        <Widget
          key="post-preview"
          src="buildhub.near/widget/Comment.Comment"
          props={{
            item,
            accountId: context.accountId,
            content: state.content,
            blockHeight: "now",
          }}
        />
      </div>
    )}
  </>
);
