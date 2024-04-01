const { Tag } = VM.require("${config_account}/widget/components") || {
  Tag: () => <></>,
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 80px 48px;
  align-items: center;
  gap: 80px;

  @media screen and (max-width: 768px) {
    padding: 32px 20px;
    gap: 50px;
  }
`;

const HeadingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  h2 {
    color: var(--paleta-escolhida-ffffff, #fff);
    text-align: center;
    font-family: Poppins, sans-serif;
    font-size: 48px;
    line-height: 120%; /* 57.6px */
    text-wrap: balance;
    margin: 0;

    span {
      color: var(--545454, #545454);
      font-size: 40px;
      font-weight: 300;
    }
  }

  h3 {
    color: var(--b-0-b-0-b-0, var(--White-50, #b0b0b0));
    text-align: center;
    margin: 0;

    /* H3/Large */
    max-width: 930px;
    font-family: InterVariable, sans-serif;
    text-wrap: balance;
    font-size: 24px;
    font-weight: 500;
    line-height: 140%; /* 33.6px */
  }

  @media screen and (max-width: 768px) {
    h2 {
      font-size: 24px;
      line-height: 130%; /* 31.2px */

      span {
        font-size: 20px;
      }
    }

    h3 {
      font-size: 14px;
    }
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  .first-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 40px;
    align-items: stretch;
  }

  .second-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px;
    align-items: stretch;
  }

  @media screen and (max-width: 768px) {
    gap: 20px;

    .first-row,
    .second-row {
      grid-template-columns: repeat(1, minmax(0, 1fr));
      gap: 20px;
    }
  }
`;

const Card = styled.div`
  display: flex;
  padding: 32px 40px;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  flex: 1 0 0;
  z-index: 1;

  border-radius: 16px;
  border: 1px solid var(--White-50, #b0b0b0);
  background: var(--000000, #000);

  overflow: hidden;

  &.first {
    border: 1px solid var(--Gradient-1, #4a21a5);
  }

  h6 {
    color: var(--eca-227, #eca227);
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 160%; /* 22.4px */
    text-transform: uppercase;
    margin: 0;
  }

  h4 {
    color: var(--paleta-escolhida-ffffff, #fff);
    font-family: "Poppins", sans-serif;
    font-size: 28px;
    line-height: 120%; /* 33.6px */
    margin: 0;

    span {
      color: var(--b-0-b-0-b-0, #b0b0b0);
    }
  }

  p {
    color: var(--6-e-6-e-6-e, var(--Black-50, #6e6e6e));
    font-family: "InterVariable", sans-serif;
    font-size: 16px;
    line-height: 120%; /* 19.2px */
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    padding: 24px 16px;

    h6 {
      font-size: 10px;
    }
    h4 {
      font-size: 22px;
    }
    p {
      font-size: 12px;
    }
  }
`;

const BlurImage = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  object-fit: cover;
  pointer-events: none;
  z-index: 0;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const AboutUs = () => {
  return (
    <Container className="container-xl position-relative" key="purposes">
      <HeadingSection>
        <Tag label="About Us" />
        <h2>
          Near Builders Cooperative (NBC){" "}
          <span>Limited Cooperative Association</span>
        </h2>
        <h3>
          Join a democratic hub where transparency, member benefits, and
          collaborative innovation thrive.
        </h3>
      </HeadingSection>
      <CardContainer>
        <div className="first-row">
          <Card className="first position-relative">
            <h6 className="z-1">Education</h6>
            <h4 className="z-1">
              Legal <span>Structure</span>
            </h4>
            <p className="z-1">
              Promotes democratic participation and financial benefits for
              members.
            </p>
            <img
              src="https://ipfs.near.social/ipfs/bafkreictjgfbnpeytoy6mnbkpjajsxfp5bznh7uclyrtff4jcr4klkwtvm"
              className="position-absolute top-0 end-0 z-0"
              style={{ pointerEvents: "none" }}
            />
          </Card>
          <Card>
            <h6>Education</h6>
            <h4>Governance</h4>
            <p>
              Communities and builder groups foster transparency and
              inclusivity.
            </p>
          </Card>
        </div>
        <div className="second-row">
          <Card>
            <h6>Education</h6>
            <h4>
              Member-Centric <span>Approach</span>
            </h4>
            <p>
              Focuses on involving members in governance and financial
              decisions, promoting a sense of ownership.
            </p>
          </Card>
          <Card>
            <h6>Education</h6>
            <h4>
              Financial <span>Distribution</span>
            </h4>
            <p>
              Net Income is allocated as patronage dividends based on member
              contributions, enhancing mutual benefits.
            </p>
          </Card>
          <Card>
            <h6>Education</h6>
            <h4>Coordination</h4>
            <p>
              Establishes clear procedures for maintaining a positive,
              productive, and collaborative community environment.
            </p>
          </Card>
        </div>
      </CardContainer>
      <BlurImage src="https://ipfs.near.social/ipfs/bafkreibxx2qqm4twammymcmvvdzrnyvg4jyob2dh7bfi6pmzz5wkflxbqy" />
    </Container>
  );
};

return { AboutUs };
