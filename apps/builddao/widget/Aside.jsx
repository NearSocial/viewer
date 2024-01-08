const { Button } = VM.require("buildhub.near/widget/components.Button");

const AsideContainer = styled.div`
  border-radius: 16px;
  border: 1px solid var(--Stroke-color, rgba(255, 255, 255, 0.2));
  background: var(--bg-1, #0b0c14);
  width: 100%;
  height: 100%;

  display: flex;
  padding: 24px 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  @media screen and (max-width: 768px) {
    border: 0px;
    flex-direction: row;
    overflow-x: auto;
  }
`;

function Aside({ Button, routes, active, setActiveRoute }) {
  return (
    <AsideContainer>
      {Object.keys(routes || {}).map((route) => (
        <Button
          key={route}
          variant={active ? "primary" : "outline"}
          onClick={() => setActiveRoute(route)}
          className={
            "align-self-stretch flex-shrink-0 justify-content-start fw-medium"
          }
          style={{ fontSize: "14px" }}
        >
          <i className={`bi ${routes[route].icon}`}></i>
          {routes[route].label}
        </Button>
      ))}
    </AsideContainer>
  );
}

return { Aside };
