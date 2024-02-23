const CoreBackdrop = styled.div`
  position: fixed;
  right: 0;
  top: 40px;
  width: 60px;
  height: auto;
  display: flex;
  z-index: 50;
`;

const CoreBox = styled.div`
  background: white;
  box-shadow: 0 10px 5px rgba(0, 0, 0, 0.3);
  z-index: 1002;

  &:hover {
    box-shadow: 0px 8px 3px rgba(0, 0, 0, 0.2);
    transform: scale(0.98) translateY(3px);
  }

  &:active {
    box-shadow: 0px 5px 2px rgba(0, 0, 0, 0.2);
    transform: scale(0.96) translateY(6px);
  }

  a {
    text-decoration: none;
    color: black;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const ArrowButton = styled.button`
  flex-grow: 1;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  text-transform: lowercase !important;
  height: 48px;
  width: 48px;
  text-align: center;
  text-decoration: none;
  border: 2px outset #333;
  cursor: pointer;
  color: #333;
  padding: 20px 20px;
  margin: 4px;

  &:active {
    border-style: inset;
    color: #000;
  }

  &:hover {
    color: #111;
  }
`;

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

const ToggleLayout = ({
  page,
  routes,
  children,
  NavLink,
  ...props
}) => {
  return (
    <Container>
      <ContentContainer key={page}>{children}</ContentContainer>
      <CoreBackdrop className="core__auth">
        <CoreBox className="classic">
          <NavLink to={Object.keys(routes).find((key) => key !== page)}>
            <Button onClick={() => {}} style={{ width: "48px", padding: 0 }}>
              swap
            </Button>
          </NavLink>
        </CoreBox>
      </CoreBackdrop>
    </Container>
  );
};

return { ToggleLayout };
