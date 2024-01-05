function Post(props) {
  return (
    <Widget
      src={"buildhub.near/widget/components.post-widget"}
      props={{ ...props }}
    />
  );
}

return { Post };
