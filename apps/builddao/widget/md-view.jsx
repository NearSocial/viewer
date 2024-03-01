const MarkdownContainer = styled.div`
  max-width: 888px;
  padding: 0 55px 55px 55px;
  background: var(--bg-1, #000000);
  border-radius: 23px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  span,
  li,
  ul,
  ol,
  p {
    color: var(--text-color, #fff) !important;
    font-family: "Inter", sans-serif !important;
  }

  pre {
    margin: 1rem 0;
    padding: 1rem;
    background: var(--bg-2, #23242b);
    border-radius: 1rem;
  }

  code {
    background: var(--bg-2, #23242b);
    color: var(--text-color, #fff) !important;
    font-family: monospace !important;
  }

  h1 {
    padding: 1rem 0;
    font-weight: 800;
  }

  h2 {
    padding: 0.5rem 0;
    font-weight: 700;
  }

  h3 {
    padding: 0.25rem 0;
    font-weight: 600;
  }

  h4,
  h5,
  h6 {
    font-weight: 500;
  }

  p,
  ul,
  li {
    color: #000;
    /* Body/14px */
    font-family: "Inter", sans-serif !important;
    font-style: normal;
    font-weight: 400;
    line-height: 170%;
  }

  @media screen and (max-width: 768px) {
    padding: 40px;
    border-radius: 10px;
  }
`;

function MarkdownView(props) {
  const content = fetch(`${props.path}`);
  if (content === null) return "";

  return (
    <MarkdownContainer>
      <Markdown text={content.body} />
    </MarkdownContainer>
  );
}

return { MarkdownView };
