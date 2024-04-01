const { Tag, Button } = VM.require("${config_account}/widget/components") || {
  Tag: () => <></>,
};

const Container = styled.div`
  display: flex;
  padding: 80px 48px;
  flex-direction: column;
  align-items: center;
  gap: 72px;

  @media screen and (max-width: 768px) {
    padding: 32px 20px;
  }
`;

const HeadingContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 24px;

  h2 {
    color: var(--paleta-escolhida-ffffff, #fff);
    text-align: center;
    font-size: 48px;
    line-height: 56px; /* 116.667% */
    font-family: "Poppins", sans-serif;
    margin: 0;

    span {
      font-weight: 700;
    }
  }

  h3 {
    color: var(--b-0-b-0-b-0, var(--White-50, #b0b0b0));
    text-align: center;
    font-size: 24px;
    font-family: "InterVariable", sans-serif;
    font-weight: 500;
    line-height: 140%; /* 33.6px */
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    h2 {
      font-size: 24px;
      line-height: 130%;
    }

    h3 {
      font-size: 14px;
    }
  }
`;

const BenefitContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  place-items: center;
  gap: 32px;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

const GlobeIcon = () => {
  return (
    <>
      <div className="d-md-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            d="M20 3.75098C16.7861 3.75098 13.6443 4.70402 10.972 6.4896C8.29969 8.27517 6.21689 10.8131 4.98696 13.7824C3.75704 16.7517 3.43524 20.019 4.06225 23.1712C4.68926 26.3234 6.23692 29.2189 8.50952 31.4915C10.7821 33.7641 13.6776 35.3117 16.8298 35.9387C19.982 36.5657 23.2493 36.2439 26.2186 35.014C29.1879 33.7841 31.7258 31.7013 33.5114 29.029C35.297 26.3567 36.25 23.2149 36.25 20.001C36.2455 15.6926 34.5319 11.562 31.4855 8.51552C28.439 5.46904 24.3084 3.75553 20 3.75098ZM33.6922 18.751H27.4688C27.2484 14.3041 25.8641 10.0838 23.5438 6.71973C26.2613 7.44931 28.6903 8.99323 30.5045 11.144C32.3187 13.2948 33.4311 15.9494 33.6922 18.751ZM20 33.7338C17.0734 30.5666 15.2984 26.0775 15.0359 21.251H24.9641C24.7016 26.0744 22.9266 30.5666 20 33.7338ZM15.0359 18.751C15.2984 13.9275 17.0672 9.43535 20 6.26816C22.9266 9.43535 24.7016 13.9244 24.9641 18.751H15.0359ZM16.4563 6.71973C14.1359 10.0838 12.7516 14.3041 12.5313 18.751H6.30782C6.56889 15.9494 7.68127 13.2948 9.49547 11.144C11.3097 8.99323 13.7387 7.44931 16.4563 6.71973ZM6.30782 21.251H12.5313C12.7516 25.6978 14.1359 29.9182 16.4563 33.2822C13.7387 32.5526 11.3097 31.0087 9.49547 28.8579C7.68127 26.7072 6.56889 24.0526 6.30782 21.251ZM23.5438 33.2822C25.8641 29.9135 27.2484 25.6932 27.4688 21.251H33.6922C33.4311 24.0526 32.3187 26.7072 30.5045 28.8579C28.6903 31.0087 26.2613 32.5526 23.5438 33.2822Z"
            fill="#6E6E6E"
          />
        </svg>
      </div>
      <div className="d-none d-md-block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="49"
          height="49"
          viewBox="0 0 49 49"
          fill="none"
        >
          <path
            d="M24.667 5C20.8103 5 17.0401 6.14366 13.8334 8.28634C10.6266 10.429 8.12726 13.4745 6.65135 17.0377C5.17544 20.6008 4.78928 24.5216 5.54169 28.3043C6.2941 32.0869 8.15129 35.5615 10.8784 38.2886C13.6055 41.0157 17.0801 42.8729 20.8627 43.6253C24.6454 44.3777 28.5662 43.9916 32.1293 42.5156C35.6925 41.0397 38.738 38.5404 40.8807 35.3336C43.0233 32.1269 44.167 28.3567 44.167 24.5C44.1615 19.33 42.1053 14.3732 38.4496 10.7174C34.7938 7.06167 29.837 5.00546 24.667 5ZM41.0976 23H33.6295C33.3651 17.6637 31.7039 12.5994 28.9195 8.5625C32.1805 9.438 35.0954 11.2907 37.2724 13.8716C39.4495 16.4526 40.7843 19.6381 41.0976 23ZM24.667 40.9794C21.1551 37.1787 19.0251 31.7919 18.7101 26H30.6239C30.3089 31.7881 28.1789 37.1787 24.667 40.9794ZM18.7101 23C19.0251 17.2119 21.1476 11.8212 24.667 8.02063C28.1789 11.8212 30.3089 17.2081 30.6239 23H18.7101ZM20.4145 8.5625C17.6301 12.5994 15.9689 17.6637 15.7045 23H8.23638C8.54966 19.6381 9.88451 16.4526 12.0616 13.8716C14.2386 11.2907 17.1535 9.438 20.4145 8.5625ZM8.23638 26H15.7045C15.9689 31.3363 17.6301 36.4006 20.4145 40.4375C17.1535 39.562 14.2386 37.7093 12.0616 35.1284C9.88451 32.5474 8.54966 29.3619 8.23638 26ZM28.9195 40.4375C31.7039 36.395 33.3651 31.3306 33.6295 26H41.0976C40.7843 29.3619 39.4495 32.5474 37.2724 35.1284C35.0954 37.7093 32.1805 39.562 28.9195 40.4375Z"
            fill="#6E6E6E"
          />
        </svg>
      </div>
    </>
  );
};

const Benefit = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  &.first {
    svg {
      filter: invert(60%) sepia(100%) saturate(392%) hue-rotate(352deg)
        brightness(97%) contrast(90%);
    }
  }

  .heading {
    color: var(--paleta-escolhida-ffffff, #fff);
    font-size: 24px;
    font-weight: 500;
    font-family: "Poppins", sans-serif;
    margin-bottom: 8px;
  }

  .content {
    color: var(--6-e-6-e-6-e, var(--Black-50, #6e6e6e));
    font-size: 16px;
    font-weight: 500;
    font-family: "InterVariable", sans-serif;
    line-height: 120%; /* 24px */
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    gap: 8px;

    .heading {
      text-align: center;
      font-size: 20px;
    }

    .content {
      text-align: center;
      font-size: 14px;
    }
  }
`;

const gridLink =
  "https://ipfs.near.social/ipfs/bafkreiay3ytllrxhtyunppqxcazpistttwdzlz3jefdbsq5tosxuryauu4";

const Banner = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 40px 60px;

  position: relative;

  border-radius: 16px;
  background: linear-gradient(104deg, #4a21a5 33.65%, #eca227 99.99%);
  box-shadow: 4px 24px 48px 0px rgba(81, 255, 234, 0.1);

  .left {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
    h3 {
      font-family: "Poppins", sans-serif;
      font-weight: 700;
    }
  }

  .right {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  @media screen and (max-width: 960px) {
    flex-direction: column;
    padding: 30px;
    gap: 40px;

    .right {
      flex-direction: column;
      align-items: center;
    }
  }
`;

const GridImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.05;
  pointer-events: none;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: "Poppins", sans-serif;

  span.leading {
    color: var(--ffffff, #fff);
    font-size: 18px;
    font-weight: 700;
    line-height: 100%; /* 28px */
  }

  span.content {
    color: var(--d-1-d-1-d-1, #d1d1d1);
    font-size: 14px;
    line-height: 120%; /* 24px */
  }

  @media screen and (max-width: 960px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Join = () => {
  return (
    <Container className="container-xl">
      <HeadingContainer>
        <Tag label="Join" />
        <h2>
          Open call for members <span>to join and contribute</span>
        </h2>
        <h3>
          Build DAO is an innovative, community-led organization intended to
          serve the open web ecosystem in multiple ways:
        </h3>
      </HeadingContainer>
      <BenefitContainer>
        <Benefit className="first">
          <GlobeIcon />
          <div>
            <h4 className="heading">Vote on important decisions</h4>
            <p className="content">
              Members collectively shape community programs and policies.
            </p>
          </div>
        </Benefit>
        <Benefit>
          <GlobeIcon />
          <div>
            <h4 className="heading">Earn Recognition and Rewards</h4>
            <p className="content">
              Members develop their own reputations as builders.
            </p>
          </div>
        </Benefit>
        <Benefit>
          <GlobeIcon />
          <div>
            <h4 className="heading">Discover Opportunities</h4>
            <p className="content">
              Members gain exposure to new gigs and interesting projects.
            </p>
          </div>
        </Benefit>
      </BenefitContainer>
      <Banner>
        <div className="z-3 left">
          <h3>Let's Join</h3>
          <Widget
            src="${config_account}/widget/components.buttons.Connect"
            props={{
              joinBtnChildren: "Join Now",
              showActivity: true,
              className: "custom-button",
            }}
          />
        </div>
        <div className="z-3 right">
          <Step>
            <span className="leading">Sign</span>
            <span className="content">membership agreement (on-chain)</span>
          </Step>
          <Step>
            <span className="leading">Propose</span>
            <span className="content">to be added to the “Community” role</span>
          </Step>
          <Step>
            <span className="leading">Fulfill</span>
            <span className="content">contribution requirements</span>
          </Step>
        </div>
        <GridImage className="z-1" src={gridLink} />
      </Banner>
    </Container>
  );
};

return { Join };
