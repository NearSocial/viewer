const { routes, active, setActiveRoute, mainContent, sideContent } = props;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1rem;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const AsideContainer = styled.div`
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

const Aside = styled.div`
  grid-column: span 1 / span 1;
`;

const MainContentContainer = styled.div`
  grid-column: span 4 / span 4;
`;

return (
  <Container>
    <Aside>
      <AsideContainer key="aside">{sideContent}</AsideContainer>
    </Aside>
    <MainContentContainer>{mainContent}</MainContentContainer>
  </Container>
);
