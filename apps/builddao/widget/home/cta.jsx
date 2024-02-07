const logoLink =
  "https://ipfs.near.social/ipfs/bafkreihbwho3qfvnu4yss3eh5jrx6uxhrlzdgtdjyzyjrpa6odro6wdxya";
const gridLink =
  "https://ipfs.near.social/ipfs/bafkreiay3ytllrxhtyunppqxcazpistttwdzlz3jefdbsq5tosxuryauu4";
const leftBlur =
  "https://ipfs.near.social/ipfs/bafkreig2cgzqloepedal5ypphzhzcakl5uoedxjtvbpxbxnywerjbzmfpm";
const rightBlur =
  "https://ipfs.near.social/ipfs/bafkreierwhnzytfajagidxim5mzdphu5fopjmlrxehatywzuy6ahr5q7pe";

const CTAContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;

  position: relative;

  padding: 6.25rem 3rem;

  @media screen and (max-width: 768px) {
    padding: 6.25rem 1.5rem;
  }
`;

const LeftBlur = styled.img`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  object-fit: cover;
  width: 25%;

  @media screen and (max-width: 768px) {
    width: 50%;
    opacity: 0.5;
  }
`;

const RightBlur = styled.img`
  position: absolute;
  right: 0;
  top: 75%;
  transform: translateY(-50%);
  object-fit: cover;
  width: 25%;

  @media screen and (max-width: 768px) {
    width: 50%;
    opacity: 0.5;
  }
`;

const Grid = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.05;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Card = styled.div`
  z-index: 2;
  display: flex;
  max-width: 37.5rem;
  padding: 2.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;

  border-radius: 16px;
  border: 1px solid #51b6ff;
  background: #000;
  box-shadow: 4px 24px 48px 0px rgba(255, 189, 52, 0.1);

  h1 {
    color: #fff;
    text-align: center;

    /* H1/large */
    font-size: 48px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 57.6px */
    margin: 0;
  }

  a {
    display: flex;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border-radius: 8px;
    background: #ffaf51;

    color: #000;
    margin: 0;

    /* Other/Button_text */
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    text-decoration: none;
    transition: all 300ms;

    &:hover {
      background: #c98a40;
    }
  }

  @media screen and (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
  }
`;

const Logo = styled.img`
  height: 2.875rem;
  object-fit: cover;
`;

const CTA = () => {
  return (
    <CTAContainer>
      <Card>
        <Logo src={logoLink} />
        <h1>Together, we can build a better future.</h1>
      </Card>
      <Grid src={gridLink} />
      <LeftBlur src={leftBlur} />
      <RightBlur src={rightBlur} />
    </CTAContainer>
  );
};

return { CTA };
