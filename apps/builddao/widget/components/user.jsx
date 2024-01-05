function User(props) {
  return (
    <Widget
      src="buildhub.near/widget/components.user-widget"
      props={{ ...props }}
    />
  );
}

return { User };
