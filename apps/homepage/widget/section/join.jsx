const SectionPill = ({ title, icon }) => {
  const Pill = styled.div`
    display: flex;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border-radius: 100px;
    border: 1px solid var(--Sea-Blue, #51ffea);
    background: rgba(81, 255, 234, 0.2);

    color: var(--Sea-Blue, #51ffea);
    text-align: center;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-transform: capitalize;

    width: max-content;
  `;

  return (
    <Pill>
      <span>{title}</span> {icon}
    </Pill>
  );
};

const MagicIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
  >
    <g clipPath="url(#clip0_1459_190)">
      <path
        d="M3.5 11.25L11 3.75L9.5 2.25L2 9.75L3.5 11.25Z"
        stroke="#51FFEA"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 3.75L9.5 5.25"
        stroke="#51FFEA"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 2.25C5 2.51522 5.10536 2.76957 5.29289 2.95711C5.48043 3.14464 5.73478 3.25 6 3.25C5.73478 3.25 5.48043 3.35536 5.29289 3.54289C5.10536 3.73043 5 3.98478 5 4.25C5 3.98478 4.89464 3.73043 4.70711 3.54289C4.51957 3.35536 4.26522 3.25 4 3.25C4.26522 3.25 4.51957 3.14464 4.70711 2.95711C4.89464 2.76957 5 2.51522 5 2.25Z"
        stroke="#51FFEA"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 7.25C10 7.51522 10.1054 7.76957 10.2929 7.95711C10.4804 8.14464 10.7348 8.25 11 8.25C10.7348 8.25 10.4804 8.35536 10.2929 8.54289C10.1054 8.73043 10 8.98478 10 9.25C10 8.98478 9.89464 8.73043 9.70711 8.54289C9.51957 8.35536 9.26522 8.25 9 8.25C9.26522 8.25 9.51957 8.14464 9.70711 7.95711C9.89464 7.76957 10 7.51522 10 7.25Z"
        stroke="#51FFEA"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1459_190">
        <rect
          width="12"
          height="12"
          fill="white"
          transform="translate(0.5 0.75)"
        />
      </clipPath>
    </defs>
  </svg>
);

const JoinContainer = styled.div`
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

const ContentContainer = styled.div`
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  h2 {
    color: #fff;
    text-align: center;
    font-size: 2.5rem;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 48px */
    margin: 0;
  }

  span.blue {
    color: var(--Sea-Blue, #51ffea);
  }

  p {
    max-width: 500px;
    color: rgba(255, 255, 255, 0.7);
    text-align: center;

    /* Body/Large */
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 170%; /* 27.2px */
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    h2 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.875rem;
    }
  }
`;

const CardContainer = styled.div`
  max-width: 36rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardIcon = () => {
  const Icon = styled.div`
    display: flex;
    width: 64px;
    height: 64px;
    padding: 1.25rem;
    justify-content: center;
    align-items: center;

    border-radius: 0.5rem;
    border: 1px solid var(--Sea-Blue, #51ffea);

    @media screen and (max-width: 768px) {
      width: 2.5rem;
      height: 2.5rem;
      padding: 7.875px 0.5rem 8.125px 0.5rem;
    }
  `;

  return (
    <Icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
      >
        <path
          d="M10 8.75H14V7.25C14 5.317 15.567 3.75 17.5 3.75C19.433 3.75 21 5.317 21 7.25C21 9.183 19.433 10.75 17.5 10.75H16V14.75H17.5C19.433 14.75 21 16.317 21 18.25C21 20.183 19.433 21.75 17.5 21.75C15.567 21.75 14 20.183 14 18.25V16.75H10V18.25C10 20.183 8.433 21.75 6.5 21.75C4.567 21.75 3 20.183 3 18.25C3 16.317 4.567 14.75 6.5 14.75H8V10.75H6.5C4.567 10.75 3 9.183 3 7.25C3 5.317 4.567 3.75 6.5 3.75C8.433 3.75 10 5.317 10 7.25V8.75ZM8 8.75V7.25C8 6.42157 7.32843 5.75 6.5 5.75C5.67157 5.75 5 6.42157 5 7.25C5 8.07843 5.67157 8.75 6.5 8.75H8ZM8 16.75H6.5C5.67157 16.75 5 17.4216 5 18.25C5 19.0784 5.67157 19.75 6.5 19.75C7.32843 19.75 8 19.0784 8 18.25V16.75ZM16 8.75H17.5C18.3284 8.75 19 8.07843 19 7.25C19 6.42157 18.3284 5.75 17.5 5.75C16.6716 5.75 16 6.42157 16 7.25V8.75ZM16 16.75V18.25C16 19.0784 16.6716 19.75 17.5 19.75C18.3284 19.75 19 19.0784 19 18.25C19 17.4216 18.3284 16.75 17.5 16.75H16ZM10 10.75V14.75H14V10.75H10Z"
          fill="#51FFEA"
        />
      </svg>
    </Icon>
  );
};

const Card = ({ title, description }) => {
  const Body = styled.div`
    display: flex;
    padding: 0.75rem;
    align-items: flex-start;
    gap: 1rem;
    align-self: stretch;

    border-radius: 12px;
    border: 1px solid var(--Stroke-color, rgba(255, 255, 255, 0.2));
    background: var(--bg-2, #23242b);

    h4 {
      color: var(--white-100, #fff);

      /* H4/Large */
      font-size: 1.125rem;
      font-style: normal;
      font-weight: 500;
      line-height: 160%; /* 28.8px */
      margin: 0;
    }

    p {
      color: var(--white-50, rgba(255, 255, 255, 0.7));

      /* Body/Large */
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 170%; /* 27.2px */
      margin: 0;
    }
  `;

  return (
    <Body>
      <CardIcon />
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </Body>
  );
};

const CTAContainer = styled.div`
  display: flex;
  max-width: 75rem;
  width: 100%;
  padding: 2.5rem;
  justify-content: center;
  align-items: flex-start;
  gap: 2.5rem;
  margin: 0 auto;

  border-radius: 1rem;
  border: 1px solid var(--Sea-Blue, #51ffea);
  background: rgba(81, 255, 234, 0.1);
  box-shadow: 0.25rem 1.5rem 3rem 0rem rgba(81, 255, 234, 0.1);

  h2 {
    max-width: 500px;
    flex: 1 0 0;

    color: var(--white-100, #fff);

    /* H2/Large */
    font-family: Satoshi;
    font-size: 40px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%; /* 48px */
  }

  span.blue {
    color: var(--Sea-Blue, #51ffea);
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding: 2.5rem 1.5rem;

    h2 {
      font-size: 1.5rem;
    }
  }
`;

const CTAContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  flex: 1 0 0;

  p {
    color: var(--Sea-Blue, #51ffea);
    /* Body/Large */
    font-family: Satoshi;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 170%; /* 27.2px */
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
`;

return (
  <JoinContainer>
    <ContentContainer>
      <SectionPill title="Join" icon={MagicIcon} />
      <h2>
        Open call for members to{" "}
        <span className="blue">join and contribute</span>
      </h2>
      <p>
        Build DAO is an innovative, community-led organization designed to serve
        the open web ecosystem in multiple ways:
      </p>
    </ContentContainer>
    <CardContainer>
      <Card
        title="Vote on Important Decisions"
        description="Members collectively shape community programs and policies."
      />
      <Card
        title="Earn Recognition and Rewards"
        description="Members develop their own reputations as builders."
      />
      <Card
        title="Discover Opportunities"
        description="Members gain exposure to new gigs and interesting projects."
      />
    </CardContainer>
    <CTAContainer>
      <h2>
        How to <span className="blue">join</span>
      </h2>
      <CTAContent>
        <p>
          1. Sign membership agreement (on-chain)
          <br />
          2. Propose to be added to the “Community” role
          <br />
          3. Fulfill contribution requirements
        </p>
        <a href="/join">Join Now</a>
      </CTAContent>
    </CTAContainer>
  </JoinContainer>
);
