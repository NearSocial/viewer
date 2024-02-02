const { Button } = VM.require("buildhub.near/widget/components");

const Container = styled.div`
  background-color: #23242b;
  color: #fff;

  width: 100%;
  height: 16rem;
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;

  margin-bottom: 1rem;
`;

return (
  <Container>
    <p>User not signed in. Please login in order to post.</p>
    <Link to={"/join"}>
      <Button variant="primary">Login</Button>
    </Link>
  </Container>
);
