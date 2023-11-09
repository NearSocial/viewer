const ownerId = "/*__@appAccount__*/";

const Root = styled.div`
  background-color: #0b0c14;
  color: #ffffff;
  font-family: Satoshi;

  width: 100%;
`;

const sections = ["hero", "goals", "join", "governance", "cta", "footer"];

return (
  <Root>
    {sections.map((section) => (
      <Widget
        src={`${ownerId}/widget/section.${section}`}
        key={`Home-Section-${section}`}
      />
    ))}
  </Root>
);
