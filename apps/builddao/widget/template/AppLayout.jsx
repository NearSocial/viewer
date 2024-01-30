/**
 * This is a standard layout with a header, body, and a footer
 */

const { Button } = VM.require("buildhub.near/widget/components");

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  // margin-top: calc(-1 * var(--body-top-padding));
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Footer = (props) => {
  return <></>;
};

// Define the new component that follows the AppLayout pattern
function AppLayout({ routes, page, children }) {
  return (
    <Container>
      {/* <AppHeader page={page} routes={routes} /> */}
      <Widget
        src="buildhub.near/widget/components.navigation.header"
        props={{ page, routes, ...props }}
      />
      <ContentContainer key={page}>{children}</ContentContainer>
      <Footer page={page} />
    </Container>
  );
}

return { AppLayout };
