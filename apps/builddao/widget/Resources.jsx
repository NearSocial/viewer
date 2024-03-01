const { Header } = VM.require("buildhub.near/widget/components.Header") || {
  Header: () => <></>,
};

const { MarkdownView } = VM.require("buildhub.near/widget/md-view") || {
  MarkdownView: () => <></>,
};

const mdPath = props.mdPath;

if (!mdPath) {
  return <p>No Markdown path configured</p>;
}

return (
  <div>
    <Header>{props.name}</Header>
    <MarkdownView path={mdPath} />
  </div>
);
