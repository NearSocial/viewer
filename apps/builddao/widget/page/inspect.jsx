const StyledWidgetSource = styled.div`
  pre {
    margin: 1rem 0;
    div {
      border-radius: 1rem;
    }
  }

  h3 {
    color: var(--text-color, #fff);
    margin-bottom: 1rem;
  }

  .text-truncate {
    color: var(--text-color, #fff);
  }

  span {
    color: var(--text-color, #fff);
  }
`;

return (
  <StyledWidgetSource className="container-xl my-3" data-bs-theme="dark">
    <Widget
      src="buildhub.near/widget/inspect.WidgetSource"
      props={{
        src: props.widgetPath,
      }}
      loading=""
    />
  </StyledWidgetSource>
);
