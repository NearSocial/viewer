const { Tag } = VM.require("buildhub.near/widget/components") || {
  Tag: () => <></>,
};

const Container = styled.div`
  padding: 50px 48px;
  position: relative;
  img.desktop {
    z-index: 0;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    object-fit: cover;
    background:
      linear-gradient(90deg, #000 0.9%, rgba(0, 0, 0, 0) 82.03%),
      linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0) 18.3%, #000 78.05%),
      lightgray 50% / cover no-repeat;
  }

  @media screen and (max-width: 768px) {
    padding: 32px 20px;

    img.desktop {
      display: none;
    }
  }
`;

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 24px;
  flex-shrink: 0;
  max-width: 576px;
  z-index: 2;

  h2 {
    color: var(--paleta-escolhida-ffffff, #fff);
    font-family: "Poppins", sans-serif;
    font-size: 48px;
    line-height: 56px; /* 116.667% */
    margin: 0;

    span {
      font-weight: 700;
    }
  }

  h3 {
    color: var(--b-0-b-0-b-0, var(--White-50, #b0b0b0));
    font-family: Inter, sans-serif;
    font-size: 24px;
    font-weight: 500;
    line-height: 140%; /* 33.6px */
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    gap: 16px;

    h2 {
      font-size: 24px;
    }

    h3 {
      font-size: 14px;
    }
  }
`;

const MobileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: none;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const Governance = () => {
  return (
    <>
      <Container className="container-xl">
        <HeadingContainer>
          <Tag label="Governance" />
          <h2>
            Let's <span>coordinate</span>!
          </h2>
          <h3>
            Build DAO upholds the principles of openness and accountability in
            its decision-making processes. We believe success depends on
            metagovernance of builders, by builders, for builders.
          </h3>
        </HeadingContainer>
        <img
          className="desktop"
          src="https://ipfs.near.social/ipfs/bafkreibm7jdr25xkk27jo2x6dyt6y2zgvxmixbgfvdkifhalntzd6qwqzq"
        />
      </Container>
      <MobileImage src="https://ipfs.near.social/ipfs/bafkreid6skww2tq5fb2f2gtnqyvpwep43y46a6qmh32ukkvkzd3tflz7de" />
    </>
  );
};

return { Governance };
