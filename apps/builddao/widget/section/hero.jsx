const logoLink =
  "https://ipfs.near.social/ipfs/bafkreihbwho3qfvnu4yss3eh5jrx6uxhrlzdgtdjyzyjrpa6odro6wdxya";
const gridLink =
  "https://ipfs.near.social/ipfs/bafkreiay3ytllrxhtyunppqxcazpistttwdzlz3jefdbsq5tosxuryauu4";
const leftBlur =
  "https://ipfs.near.social/ipfs/bafkreig2cgzqloepedal5ypphzhzcakl5uoedxjtvbpxbxnywerjbzmfpm";
const rightBlur =
  "https://ipfs.near.social/ipfs/bafkreierwhnzytfajagidxim5mzdphu5fopjmlrxehatywzuy6ahr5q7pe";

const HeroContainer = styled.div`
  width: 100%;
  position: relative;

  padding: 9.375rem 3rem;

  @media screen and (max-width: 768px) {
    padding: 9.375rem 1.5rem;
  }
`;

const LeftBlur = styled.img`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  object-fit: cover;
  width: 25%;
  pointer-events: none;

  @media screen and (max-width: 768px) {
    width: 50%;
    opacity: 0.5;
  }
`;

const RightBlur = styled.img`
  position: absolute;
  right: 0;
  top: 100%;
  transform: translateY(-50%);
  object-fit: cover;
  width: 25%;
  pointer-events: none;

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
  pointer-events: none;
`;

const Logo = styled.img`
  height: 54px;
  object-fit: cover;
`;

const Tagline = styled.h1`
  max-width: 700px;

  text-align: center;
  font-size: 3rem;
  font-style: normal;
  font-weight: 500;
  line-height: 120%; /* 57.6px */
  margin: 0;

  text-wrap: balance;

  span.muted {
    color: rgba(255, 255, 255, 0.7);
  }

  @media screen and (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;

  margin: 0 auto;
`;

return (
  <HeroContainer>
    <Content>
      <Logo src={logoLink} />
      <Tagline>
        Designed to connect and empower builders in a{" "}
        <span className="muted">multi-chain ecosystem</span>
      </Tagline>
    </Content>
    <Grid src={gridLink} />
    <LeftBlur src={leftBlur} />
    <RightBlur src={rightBlur} />
  </HeroContainer>
);
