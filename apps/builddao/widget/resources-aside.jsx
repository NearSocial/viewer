const { Button } =
  VM.require("buildhub.near/widget/components") || (() => <></>);

const Container = styled.div`
  border-radius: 16px;
  border: 1px solid var(--Stroke-color, rgba(255, 255, 255, 0.2));
  background: var(--bg-1, #0b0c14);
  width: 100%;

  display: flex;
  padding: 24px 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 1rem;
  height: calc(min(100vh - 64px, 100%));

  @media screen and (max-width: 768px) {
    border: 0px;
    flex-direction: row;
    overflow-x: auto;
  }
`;

return (
  <Container>
    {props.resources.map((resource) => (
      <Button
        variant={
          props.currentResource === resource.name ? "primary" : "outline"
        }
        onClick={() => props.setCurrentResource(resource.name)}
        className={
          "align-self-stretch flex-shrink-0 justify-content-start fw-medium"
        }
        style={{ fontSize: "14px" }}
      >
        <i className={`bi ${resource.biIcon}`}></i> {resource.name}
      </Button>
    ))}
  </Container>
);
