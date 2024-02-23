/**
 * This is a standard layout with a header, body, and a footer
 */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

function AppLayout({ page, Header, Footer, children, ...props }) {
  return (
    <Container key={page}>
      <Header {...props} />
      <ContentContainer key={page}>{children}</ContentContainer>
      <Footer {...props} />
    </Container>
  );
}

return { AppLayout };
