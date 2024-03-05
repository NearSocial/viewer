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
  background: #000000;
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

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M8 2.75H1L9.26086 13.7645L1.44995 22.7499H4.09998L10.4883 15.401L16 22.75H23L14.3917 11.2723L21.8001 2.75H19.1501L13.1643 9.63578L8 2.75ZM17 20.75L5 4.75H7L19 20.75H17Z"
      fill="white"
    />
  </svg>
);

const Footer = ({ noBanner }) => {
  return (
    <Container className="container-xl">
      {!noBanner && (
        <Card>
          <div className="d-flex flex-column align-items-center">
            <img src="https://ipfs.near.social/ipfs/bafkreifotevq6g6ralhvutlcssaasa7xbfjjc6mbo5hlnvgpxxgfmwswmq" />
            <h3>
              Together, we can <span>build a better future</span>.
            </h3>
          </div>
          <Widget
            src="/*__@appAccount__*//widget/components.buttons.Connect"
            props={{
              joinBtnChildren: "Join Now",
              showActivity: true,
              className: "custom-button",
            }}
          />
        </Card>
      )}
      <FooterContainer>
        <LinksContainer>
          <a
            href="https://twitter.com/nearbuilders"
            className="d-flex align-items-center"
            target="_blank"
          >
            <XIcon />
          </a>
          <a href="https://nearbuilders.com/tg-builders" target="_blank">
            <i className="bi bi-telegram"></i>
          </a>
          <a href="https://github.com/NEARBuilders" target="_blank">
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
