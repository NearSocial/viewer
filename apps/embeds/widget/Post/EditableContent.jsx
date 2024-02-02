// EditableContent:
// get the nested content using its URI and pass it's contents to a "normal" post content widget

const href = props.href;
const content = JSON.parse(Social.get(href, "final") || {});

return (
  <Widget
    key="content"
    loading={<div className="w-100" style={{ height: "100px" }} />}
    src="mob.near/widget/MainPage.N.Post.Content"
    props={{
      content: content,
      noEmbed: false,
    }}
  />
);
