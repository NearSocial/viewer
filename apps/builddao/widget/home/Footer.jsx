const Container = styled.div`
  padding: 32px 50px;
  display: flex;
  flex-direction: column;
  gap: 80px;

  @media screen and (max-width: 768px) {
    padding: 32px 20px;
    gap: 40px;
  }
`;

const Card = styled.div`
  display: flex;
  padding: 56px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  width: 100%;

  border-radius: 16px;
  border: 1px solid var(--Gradient-1, #4a21a5);
  background: #0d020f;
  box-shadow: 4px 24px 48px 0px rgba(249, 225, 122, 0.05);

  img {
    width: 90px;
    object-fit: cover;
    height: 100px;
    border-radius: 20px;
  }

  h3 {
    color: var(--paleta-escolhida-ffffff, #fff);
    text-align: center;
    font-family: "Poppins", sans-serif;
    font-size: 48px;
    line-height: normal;
    text-wrap: balance;
    margin: 0;

    span {
      font-weight: 700;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 24px 20px;
    gap: 30px;

    img {
      width: 71.272px;
      height: 80px;
    }

    h3 {
      font-size: 28px;
    }
  }
`;

const FooterContainer = styled.div`
  padding: 32px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  p {
    color: var(--b-0-b-0-b-0, var(--White-50, #b0b0b0));
    text-align: center;
    font-family: "InterVariable", sans-serif;
    font-size: 16px;
    line-height: 170%; /* 27.2px */
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    p {
      font-size: 14px;
    }
  }
`;

const LinksContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  a {
    font-size: 24px;
    color: #fff;
    text-decoration: none;
    transition: all 300ms;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const Footer = () => {
  return (
    <Container className="container-xl">
      <Card>
        <img src="https://ipfs.near.social/ipfs/bafkreifcrvkgibbu4xpfxnxf3pnyhxvojqlffd2zmoxfbyapacy62rwwqu" />
        <h3>
          Together, we can <span>build a better future</span>.
        </h3>
        <Widget
          src="/*__@appAccount__*//widget/components.buttons.Connect"
          props={{
            joinBtnChildren: "Join Now",
            showActivity: true,
            className: "custom-button",
          }}
        />
      </Card>
      <FooterContainer>
        <LinksContainer>
          <a href="https://twitter.com/nearbuilders" target="_blank">
            <i className="bi bi-twitter-x"></i>
          </a>
          <a href="https://nearbuilders.com/tg-builders" target="_blank">
            <i className="bi bi-telegram"></i>
          </a>
          <a href="https://github.near/NEARBuilders" target="_blank">
            <i className="bi bi-github"></i>
          </a>
          <a href="https://devs.near.social/" target="_blank">
            <i className="bi bi-code-slash"></i>
          </a>
        </LinksContainer>
        <p>@{new Date().getFullYear()} BuildDAO all rights reserved</p>
      </FooterContainer>
    </Container>
  );
};

return { Footer };
