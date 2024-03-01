const { Tag } = VM.require("buildhub.near/widget/components") || {
  Tag: () => <></>,
};

const Container = styled.div`
  padding: 32px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;

  @media screen and (max-width: 768px) {
    padding: 32px 20px;
  }
`;

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  h2 {
    color: var(--paleta-escolhida-ffffff, #fff);
    text-align: center;
    font-family: "Poppins", sans-serif;

    font-size: 48px;
    line-height: 56px; /* 116.667% */
    text-wrap: balance;

    span {
      color: var(--paleta-escolhida-ffffff, #fff);
      font-weight: 600;
    }
  }

  h3 {
    color: var(--b-0-b-0-b-0, var(--White-50, #b0b0b0));
    font-size: 24px;
    font-weight: 500;
    line-height: 140%; /* 33.6px */
    font-family: "InterVariable", sans-serif;
    margin: 0;
    text-align: center;
  }

  @media screen and (max-width: 768px) {
    h2 {
      font-size: 24px;
      line-height: 130%; /* 31.2px */
    }

    h3 {
      font-size: 14px;
    }
  }
`;

const GoalsContainer = styled.div`
  display: grid;
  gap: 32px;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 20px;
  }
`;

const GridItem = styled.div`
  display: flex;
  grid-column: span 1 / span 2;
  padding: 32px 56px;
  flex-direction: column;
  gap: 12px;
  flex: 1 0 0;

  border-radius: 16px;
  border: 1px solid var(--White-50, #b0b0b0);
  background: var(--000000, #000);

  &.first {
    display: flex;
    grid-column: span 2 / span 2;
    padding: 32px 56px;

    border-radius: 16px;
    border: 1px solid var(--Gradient-1, #4a21a5);
    background: var(--000000, #000);

    .heading {
      font-size: 40px;
    }

    overflow: hidden;
  }

  .category {
    color: var(--eca-227, #eca227);
    font-size: 14px;
    font-weight: 400;
    line-height: 160%; /* 22.4px */
    font-family: "Poppins", sans-serif;
    text-transform: uppercase;
    margin: 0;
  }

  .heading {
    color: var(--paleta-escolhida-ffffff, #fff);
    font-size: 32px;
    font-weight: 400;
    font-family: "Poppins", sans-serif;
    margin: 0%;
    z-index: 2;

    span {
      color: var(--b-0-b-0-b-0, #b0b0b0);
    }
  }

  .content {
    margin: 0;
    color: var(--b-0-b-0-b-0, var(--White-50, #b0b0b0));
    font-size: 16px;
    font-family: "Poppins", sans-serif;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 22.4px */
    z-index: 2;
  }

  @media screen and (max-width: 768px) {
    padding: 24px 16px;
    gap: 8px;

    &.first {
      grid-column: span 1 / span 2;
      padding: 24px 16px;

      img {
        height: 50%;
        width: 50%;
        object-fit: cover;
        z-index: 1;
      }
    }

    .category {
      font-size: 10px;
    }

    .heading {
      font-size: 22px !important;
    }

    .content {
      font-size: 12px;
      line-height: 140%;
    }
  }
`;

const Goals = () => {
  return (
    <Container className="container-xl">
      <HeadingContainer>
        <Tag label="Goals" />
        <h2>
          NEAR Builders Cooperative is a support system, owned and governed{" "}
          <span>by members of Build DAO.</span>
        </h2>
        <h3>
          Charting the Course: Primary Objectives Guiding the DAO's Mission
        </h3>
      </HeadingContainer>
      <GoalsContainer>
        <GridItem className="first position-relative">
          <h6 className="category">Development</h6>
          <h4 className="heading">
            Support <span>Builders</span>
          </h4>
          <p className="content">
            The core mission is to build open-source infrastructure and web
            applications for everyone. By creating systems to reward useful
            contributions, we can grow successful projects that solve problems
            and generate sustainable value.
          </p>
          <img
            src="https://ipfs.near.social/ipfs/bafkreictjgfbnpeytoy6mnbkpjajsxfp5bznh7uclyrtff4jcr4klkwtvm"
            className="position-absolute top-0 end-0"
          />
        </GridItem>
        <GridItem>
          <h6 className="category">Education</h6>
          <h4 className="heading">Learn Together</h4>
          <p className="content">
            We are cultivating a worldwide community of builders who are
            motivated to help others. Members can earn badges and get necessary
            resources for training potential contributors.
          </p>
        </GridItem>
        <GridItem>
          <h6 className="category">Community</h6>
          <h4 className="heading">Facilitate Governance</h4>
          <p className="content">
            We introduced on-chain feedback channels to gather input from
            participants. This will be crucial for understanding common issues,
            optimizing documentation, and improving quality of experience.
          </p>
        </GridItem>
      </GoalsContainer>
    </Container>
  );
};

return { Goals };
