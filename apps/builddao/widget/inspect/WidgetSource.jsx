const src = props.src ?? "mob.near/widget/WidgetSource";
const blockHeight = props.blockHeight;
const [accountId, widget, widgetName] = src.split("/");

const code = Social.get(src, blockHeight);

const text = `
\`\`\`jsx
${code}
\`\`\`
`;

return (
  <>
    <Widget
      src="mob.near/widget/WidgetMetadata"
      props={{ accountId, widgetName, expanded: true }}
    />
    <Markdown text={text} />
    <h3>Dependencies</h3>
    <Widget
      src="buildhub.near/widget/inspect.WidgetDependencies"
      props={{ src, code }}
    />
  </>
);
