const Container = styled.div`
  border-radius: 16px;
  border: 1px solid var(--23242-b, #23242b);
  background: var(--000000, #000);

  height: 75px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1rem;

  h2 {
    color: #fff;
    text-align: center;
    font-family: Poppins;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin: 0;
    text-transform: capitalize;
  }

  @media screen and (max-width: 768px) {
    height: 64px;
    padding: 0 16px;

    h2 {
      font-size: 16px;
    }
  }
`;

const Header = ({ children, asChild }) => {
  return <Container>{!asChild ? <h2>{children}</h2> : children}</Container>;
};

return { Header };
