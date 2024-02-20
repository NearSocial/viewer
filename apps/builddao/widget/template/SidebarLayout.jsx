const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1rem;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const SidebarContainer = styled.div`
  border-radius: 16px;
  border: 1px solid var(--stroke-color, rgba(255, 255, 255, 0.2));
  background: var(--bg-1, #0b0c14);
  width: 100%;
  min-height: 80vh;
  display: flex;
  padding: 24px 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 1rem;

  @media screen and (max-width: 768px) {
    border: 0px;
    flex-direction: row;
    overflow-x: auto;
    min-height: auto;
  }
`;

const ContentContainer = styled.div`
  grid-column: span 4 / span 4;
`;

const Sidebar = ({ currentPath, page, routes }) => (
  <>
    {routes &&
      (Object.keys(routes) || []).map((k) => {
        const route = routes[k];
        if (route.hide) {
          return null;
        }
        return (
          <Button
            id={k}
            variant={page === k ? "primary" : "outline"}
            href={`${currentPath}&tab=${k}`}
            className={
              "justify-content-start fw-medium align-self-stretch w-100"
            }
            linkClassName={"d-flex w-100"}
            style={{
              fontSize: "14px",
              textDecoration: "none",
              cursor: "pointer",
              padding: "8px 12px",
              gap: "10px",
            }}
          >
            {route.init.icon && <i className={`bi ${route.init.icon} `} />}
            <span>{route.init.name}</span>
          </Button>
        );
      })}
  </>
);

// Define the new component that follows the SidebarLayout pattern
function SidebarLayout({ currentPath, routes, page, children }) {
  return (
    <Container className="container-xl mt-md-3">
      <SidebarContainer>
        <Sidebar currentPath={currentPath} page={page} routes={routes} />
      </SidebarContainer>
      <ContentContainer key={page}>{children}</ContentContainer>
    </Container>
  );
}

return { SidebarLayout };
