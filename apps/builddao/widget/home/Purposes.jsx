const { Button, Tag } = VM.require("${config_account}/widget/components") || {
  Button: () => <></>,
  Tag: () => <></>,
};

const gridLink =
  "https://ipfs.near.social/ipfs/bafkreiay3ytllrxhtyunppqxcazpistttwdzlz3jefdbsq5tosxuryauu4";

const Container = styled.div`
  padding: 50px 48px;
  display: flex;
  flex-direction: column;
  gap: 100px;

  @media screen and (max-width: 768px) {
    padding: 32px 20px;
    gap: 50px;
  }
`;

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  h2 {
    color: var(--paleta-escolhida-ffffff, #fff);
    font-size: 44px;
    line-height: 110%;
    text-wrap: balance;
    font-family: "Poppins", sans-serif;
    margin: 0;

    span {
      font-weight: 700;
    }
  }

  h3 {
    color: var(--b-0-b-0-b-0, var(--White-50, #b0b0b0));
    font-size: 24px;
    font-weight: 500;
    margin: 0;
    font-family: "InterVariable", sans-serif;
    line-height: 140%; /* 33.6px */
    max-width: 930px;
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

const StepContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  place-items: center;
  align-items: stretch;
  gap: 32px;

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

const Step = styled.div`
  display: flex;
  padding: 40px 56px;
  flex-direction: column;
  gap: 40px;

  border-radius: 16px;
  border: 1px solid var(--White-50, #b0b0b0);
  background: var(--000000, #000);

  &.first {
    border: 1px solid var(--Gradient-1, #4a21a5);
  }

  h4 {
    color: var(--eca-227, #eca227);
    font-size: 52px;
    font-weight: 900;
    line-height: 140%; /* 89.6px */
    margin: 0;
  }

  h5 {
    color: var(--paleta-escolhida-ffffff, #fff);
    font-size: 28px;
    line-height: 120%; /* 43.2px */
    margin-bottom: 12px;
  }

  p {
    color: var(--6-e-6-e-6-e, var(--Black-50, #6e6e6e));
    font-size: 18px;
    line-height: 120%; /* 33.6px */
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    padding: 24px 16px;
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: 16px;

    h4 {
      font-size: 32px;
    }

    h5 {
      font-size: 20px;
      line-height: normal;
      margin: 0;
    }

    p {
      font-size: 18px;
    }
  }
`;

const Banner = styled.div`
  padding: 40px 60px;
  position: relative;

  border-radius: 16px;
  background: linear-gradient(104deg, #eca227 33.65%, #4a21a5 99.99%);
  box-shadow: 4px 24px 48px 0px rgba(81, 255, 234, 0.1);

  .container {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;

    h3 {
      color: var(--paleta-escolhida-ffffff, #fff);
      font-family: Poppins, sans-serif;
      font-size: 44px;
      font-weight: 500;
      line-height: 120%; /* 52.8px */
      text-wrap: balance;
      margin: 0;

      span {
        font-weight: 700;
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      p {
        color: var(--ffffff, #fff);
        font-family: Poppins, sans-serif;
        font-size: 20px;
        font-weight: 500;
        line-height: 150%;
        margin: 0;
        text-align: right;

        span {
          font-weight: 700;
        }

        a {
          color: var(--ffffff, #fff);
          text-decoration: underline;
        }
      }
    }
  }

  @media screen and (max-width: 960px) {
    flex-direction: column;
    padding: 30px;
    gap: 40px;

    .container {
      flex-direction: column;
      gap: 24px;

      h3 {
        font-size: 24px;
        text-align: center;
      }

      .right {
        p {
          font-size: 14px;
          text-align: center;
        }
      }
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

const Purposes = () => {
  return (
    <Container className="container-xl" key="purposes">
      <HeadingContainer>
        <Tag label="Purposes" />
        <h2>
          Build DAO has three main purposes in one:
          <span>Everyone builds everything together!</span>
        </h2>
        <h3>
          Unite in purpose at Build DAO: crafting a global future, empowering
          builders, and fostering impactful projects collaboratively.
        </h3>
      </HeadingContainer>
      <StepContainer>
        <Step className="first">
          <h4>1</h4>
          <div>
            <h5>To build a better future</h5>
            <p>for the open web worldwide</p>
          </div>
        </Step>
        <Step>
          <h4>2</h4>
          <div>
            <h5>To connect and empower </h5>
            <p>communities of builders to create anything useful</p>
          </div>
        </Step>
        <Step>
          <h4>3</h4>
          <div>
            <h5>Helping each other to create</h5>
            <p>successful projects with really positive impact</p>
          </div>
        </Step>
      </StepContainer>
      {/* <Banner>
        <div className="container z-2">
          <h3>
            Your project & Everything.dev & <span>Create together.</span>
          </h3>
          <div className="right">
            <p>
              Use a toolkit + workspaces using the app structure from{" "}
              <a href="https://everything.dev" target="_blank">
                Everything.dev
              </a>
              , with{" "}
              <span>
                flexible, customizable type system to support development of any
                & all open web things.
              </span>
            </p>
            <p className="fw-light">
              Including SDKs, libraries, apps, docs, groups, etc.
            </p>
          </div>
        </div>
        <div className="z-2 mt-3 d-flex justify-content-center justify-content-md-start mt-md-4 position-relative">
          <Button
            href={`https://near.social/hack.near/widget/app.create`}
            noLink={true}
            target="_blank"
            style={{ width: 60, backgroundColor: "#4A21A5" }}
          >
            Try it
          </Button>
        </div>
        <GridImage src={gridLink} />
      </Banner> */}
    </Container>
  );
};

return { Purposes };
