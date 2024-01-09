const MarkdownContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 0;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  span {
    color: #fff !important;
    font-family: "Inter", sans-serif !important;
  }

  h1 {
    /* H1/large */
    font-size: 48px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 57.6px */
  }

  p,
  ul,
  li {
    color: var(--White-50, #cdd0d5);
    /* Body/14px */
    font-family: "Inter", sans-serif !important;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 170%; /* 23.8px */
  }

  @media screen and (max-width: 768px) {
    padding: 24px;
  }
`;

function MarkdownView(props) {
  const content = fetch(`${props.path}`);
  if (content === null) return "";

  return (
    <MarkdownContainer>
      <Widget
        src="openwebbuild.near/widget/Post.Markdown"
        props={{
          text: content.body,
        }}
      />
    </MarkdownContainer>
  );
}

return { MarkdownView };
