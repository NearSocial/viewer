const { MarkdownView } = VM.require("buildhub.near/widget/md-view") || {
  MarkdownView: () => <></>,
};

const mdPath = props.mdPath;

if (!mdPath) {
  return <p>No Markdown path configured</p>;
}

return <MarkdownView path={mdPath} />;
