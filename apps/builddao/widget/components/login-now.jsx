console.log(props);

const Container = styled.div`
  background-color: #23242b;
  color: #ffffff;

  width: 100%;
  height: 16rem;
  border-radius: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  button {
    all: unset;
    cursor: pointer;
    display: flex;
    padding: 16px 20px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border-radius: 8px;
    border: 1px solid var(--white-100, #fff);
    background: #fff;
    transition: all 300ms;

    &:hover {
      text-decoration: none;
    }

    color: var(--black-100, #000);

    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

return (
  <Container>
    <button onClick={props.requestSignIn}>Login</button>
  </Container>
);
