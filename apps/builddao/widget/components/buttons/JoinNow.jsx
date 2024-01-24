const { checkIsMemberOrPending } = VM.require(
  "buildhub.near/widget/core.lib.common"
);

checkIsMemberOrPending || (checkIsMemberOrPending = () => {});

const isMemberOrPending = checkIsMemberOrPending(context.accountId);

const Button = styled.a`
  width: max-content;
  all: unset;
  display: flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: none;
    color: #000 !important;
    cursor: pointer;
    background: var(--Yellow, #ffaf51);
  }

  border-radius: 8px;
  background: var(--Yellow, #ffaf51);

  color: var(--black-100, #000);

  /* Other/Button_text */
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  @media screen and (max-width: 768px) {
    flex: 1 1 0;
  }
`;

const Container = styled.div`
  width: max-content;
  margin-left: auto;

  @media screen and (max-width: 768px) {
    margin: 0;
    width: 100%;

    display: flex;
    justify-content: center;
  }
`;

return (
  <Container>
    {!isMemberOrPending ? (
      <Button href={"/join"}>Join Now</Button>
    ) : (
      props.children
    )}
  </Container>
);
