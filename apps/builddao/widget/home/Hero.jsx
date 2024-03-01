const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => {},
};

const gridLink =
  "https://ipfs.near.social/ipfs/bafkreiay3ytllrxhtyunppqxcazpistttwdzlz3jefdbsq5tosxuryauu4";
const logoLink =
  "https://ipfs.near.social/ipfs/bafkreifnxc6jk66wdy377ttcinogwr4xqnllsrjfmnglvoonikafzksdui";
const leftBlur =
  "https://ipfs.near.social/ipfs/bafkreiabxzgspdolrlol2gvw7gnyrtktmfg23pd2ykow5pdddtmz3ve45y";
const rightBlur =
  "https://ipfs.near.social/ipfs/bafkreigxwshevkyp6rt2l6gjxeap4b6yetxhusyn6swfhh4rtwvp3kkgqu";
const mobileBlur =
  "https://ipfs.near.social/ipfs/bafkreid6k74swyhmqmq6vedpafumz6cywbok72zckkgemzg6jec7sk5fpm";

const Grid = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.02;
  object-fit: cover;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 40px;

  padding: 48px;

  @media screen and (max-width: 768px) {
    padding: 32px 20px;
    gap: 20px;
  }
`;

const Logo = styled.img`
  height: 80px;
  width: 235px;
  object-fit: cover;

  @media screen and (max-width: 768px) {
    height: 26px;
    width: 71px;
  }
`;

const Heading = styled.h1`
  color: var(--text-color, #fff);
  font-family: "Poppins", sans-serif;
  font-size: 58px;
  line-height: 120%; /* 69.6px */
  text-wrap: balance;
  margin: 0;

  span {
    color: var(--eca-227, #eca227);
    font-weight: 600;
  }

  @media screen and (max-width: 768px) {
    font-size: 40px;
  }
`;

const Subheading = styled.h2`
  color: var(--white-50, #b0b0b0);
  font-size: 24px;
  font-weight: 500;
  font-family: InterVariable;
  line-height: 140%; /* 33.6px */
  margin: 0;

  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

const Phrase = styled.p`
  color: #7f7f7f;
  font-size: 14px;
  font-family: InterVariable, sans-serif;
  margin: 0;

  @media screen and (max-width: 768px) {
    font-size: 10px;
  }
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;

  @media screen and (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    place-items: center;
  }
`;

const InfoStat = ({ amount, label }) => {
  return (
    <div className="d-flex gap-2 align-items-center">
      <div className="d-none d-md-block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
        >
          <path
            d="M24 4.5C20.1433 4.5 16.3731 5.64366 13.1664 7.78634C9.95963 9.92903 7.46027 12.9745 5.98436 16.5377C4.50845 20.1008 4.12228 24.0216 4.8747 27.8043C5.62711 31.5869 7.4843 35.0615 10.2114 37.7886C12.9386 40.5157 16.4131 42.3729 20.1957 43.1253C23.9784 43.8777 27.8992 43.4916 31.4623 42.0156C35.0255 40.5397 38.071 38.0404 40.2137 34.8336C42.3564 31.6269 43.5 27.8567 43.5 24C43.4945 18.83 41.4383 13.8732 37.7826 10.2174C34.1268 6.56167 29.1701 4.50546 24 4.5ZM40.4306 22.5H32.9625C32.6981 17.1637 31.0369 12.0994 28.2525 8.0625C31.5135 8.938 34.4284 10.7907 36.6055 13.3716C38.7825 15.9526 40.1174 19.1381 40.4306 22.5ZM24 40.4794C20.4881 36.6787 18.3581 31.2919 18.0431 25.5H29.9569C29.6419 31.2881 27.5119 36.6787 24 40.4794ZM18.0431 22.5C18.3581 16.7119 20.4806 11.3212 24 7.52063C27.5119 11.3212 29.6419 16.7081 29.9569 22.5H18.0431ZM19.7475 8.0625C16.9631 12.0994 15.3019 17.1637 15.0375 22.5H7.56938C7.88267 19.1381 9.21752 15.9526 11.3946 13.3716C13.5716 10.7907 16.4865 8.938 19.7475 8.0625ZM7.56938 25.5H15.0375C15.3019 30.8363 16.9631 35.9006 19.7475 39.9375C16.4865 39.062 13.5716 37.2093 11.3946 34.6284C9.21752 32.0474 7.88267 28.8619 7.56938 25.5ZM28.2525 39.9375C31.0369 35.895 32.6981 30.8306 32.9625 25.5H40.4306C40.1174 28.8619 38.7825 32.0474 36.6055 34.6284C34.4284 37.2093 31.5135 39.062 28.2525 39.9375Z"
            fill="#6E6E6E"
          />
        </svg>
      </div>
      <div className="d-block d-md-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="31"
          viewBox="0 0 30 31"
          fill="none"
        >
          <path
            d="M15.0423 3.60059C12.6665 3.60059 10.3441 4.30508 8.36877 5.62497C6.39341 6.94487 4.8538 8.82089 3.94464 11.0158C3.03548 13.2107 2.7976 15.6259 3.26109 17.956C3.72457 20.2861 4.8686 22.4264 6.54851 24.1064C8.22842 25.7863 10.3688 26.9303 12.6989 27.3938C15.029 27.8573 17.4442 27.6194 19.6391 26.7102C21.834 25.8011 23.71 24.2615 25.0299 22.2861C26.3498 20.3107 27.0543 17.9883 27.0543 15.6126C27.0509 12.4278 25.7843 9.37449 23.5323 7.12253C21.2804 4.87058 18.227 3.60395 15.0423 3.60059ZM25.1635 14.6886H20.5632C20.4003 11.4015 19.377 8.2818 17.6618 5.79509C19.6706 6.33439 21.4662 7.47566 22.8072 9.06552C24.1483 10.6554 24.9706 12.6176 25.1635 14.6886ZM15.0423 25.7639C12.879 23.4227 11.5669 20.1044 11.3728 16.5366H18.7117C18.5177 20.1021 17.2056 23.4227 15.0423 25.7639ZM11.3728 14.6886C11.5669 11.1231 12.8743 7.80248 15.0423 5.46129C17.2056 7.80248 18.5177 11.1208 18.7117 14.6886H11.3728ZM12.4227 5.79509C10.7076 8.2818 9.68423 11.4015 9.52138 14.6886H4.92101C5.114 12.6176 5.93627 10.6554 7.27732 9.06552C8.61838 7.47566 10.414 6.33439 12.4227 5.79509ZM4.92101 16.5366H9.52138C9.68423 19.8237 10.7076 22.9434 12.4227 25.4301C10.414 24.8908 8.61838 23.7495 7.27732 22.1597C5.93627 20.5698 5.114 18.6075 4.92101 16.5366ZM17.6618 25.4301C19.377 22.9399 20.4003 19.8203 20.5632 16.5366H25.1635C24.9706 18.6075 24.1483 20.5698 22.8072 22.1597C21.4662 23.7495 19.6706 24.8908 17.6618 25.4301Z"
            fill="#6E6E6E"
          />
        </svg>
      </div>
      <div className="d-flex flex-column">
        <span
          style={{
            fontSize: 26,
            fontWeight: 500,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          +{amount}
        </span>
        <span
          style={{
            fontWeight: 500,
            fontSize: 14,
            color: "var(--Black-50, #6E6E6E)",
            fontFamily: "InterVariable, sans-serif",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media screen and (max-width: 768px) {
    gap: 12px;
  }
`;

const RightBlur = styled.img`
  position: absolute;
  right: 0;
  bottom: -316px;
  opacity: 0.5;
  pointer-events: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const LeftBlur = styled.img`
  position: absolute;
  left: 0;
  top: -316px;
  opacity: 0.5;
  pointer-events: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileBlur = styled.img`
  display: none;

  @media screen and (max-width: 768px) {
    position: absolute;
    right: 0;
    bottom: -15px;
    opacity: 0.5;
    display: block;
    pointer-events: none;
  }
`;

const Hero = (props) => {
  const { signedIn, currentGateway } = props;
  return (
    <div className="position-relative">
      <Container className="container-xl mt-md-3 z-3">
        <Logo src={logoLink} />
        <HeadingContainer>
          <Heading>
            Designed to connect and empower builders in a{" "}
            <span>multi-chain ecosystem</span>
          </Heading>
          <Subheading>
            Empowering Builders: Strengthening Connections in Multi-Chain
            Systems
          </Subheading>
        </HeadingContainer>
        <div className="d-flex align-items-center gap-4">
          {currentGateway && !signedIn ? (
            <>
              <a
                href={"https://nearbuilders.org/join?from=trial"}
                style={{ textDecoration: "none" }}
              >
                <Button style={{ background: "#4A21A5", color: "white" }}>
                  Create Trial Account
                </Button>
              </a>
              <Phrase>
                Try out the Builders Gateway with a trial account.
                <br />
                No passphrases, no crypto required.
              </Phrase>
            </>
          ) : (
            <>
              <Button
                href={href({
                  widgetSrc: "buildhub.near/widget/app",
                  params: {
                    page: "feed",
                  },
                })}
                style={{ background: "#4A21A5", color: "white" }}
              >
                See Activity
              </Button>
            </>
          )}
        </div>
        {/* <Stats>
          <InfoStat label="Lorem" amount={100} />
          <InfoStat label="Lorem" amount={100} />
          <InfoStat label="Lorem" amount={100} />
          <InfoStat label="Lorem" amount={100} />
        </Stats> */}
      </Container>
      <MobileBlur src={mobileBlur} />
      <LeftBlur src={leftBlur} />
      <RightBlur src={rightBlur} />
      <Grid src={gridLink} />
    </div>
  );
};

return { Hero };
