const { Button } = VM.require("${config_account}/widget/components") || {
  Button: () => <></>,
};

const item = props.item;
const closeModal = props.closeModal;

const handleDelete = () => {
  Social.set({
    index: {
      modify: JSON.stringify({
        key: item,
        value: {
          type: "delete",
        },
      }),
    },
  });
};

return (
  <>
    <div className="mb-3">
      <p className="mb-1">Are you sure you want to delete this post?</p>
      <small>
        <i>
          This post will only be hidden on NEARBuilders Gateway and not on other
          gateways
        </i>
      </small>
    </div>
    <div className="d-flex align-items-center justify-content-end gap-3">
      <Button variant="outline" onClick={closeModal}>
        Cancel
      </Button>
      <Button
        variant="primary"
        style={{ background: "var(--system-red, #fd2a5c)" }}
        onClick={handleDelete}
      >
        Delete Post
      </Button>
    </div>
  </>
);
