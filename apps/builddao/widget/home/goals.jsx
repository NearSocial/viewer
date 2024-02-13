const GoalsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3.125rem;

  position: relative;

  padding: 6.25rem 3rem;

  @media screen and (max-width: 768px) {
    padding: 6.25rem 1.5rem;
  }
`;

const SectionPill = ({ title, icon }) => {
  const Pill = styled.div`
    display: flex;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border-radius: 100px;
    border: 1px solid var(--Yellow, #ffaf51);
    background: rgba(255, 189, 52, 0.2);

    color: var(--Yellow, #ffaf51);
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
    width="12"
    height="13"
    viewBox="0 0 12 13"
    fill="none"
  >
    <g clipPath="url(#clip0_1459_202)">
      <path
        d="M3 11.25L10.5 3.75L9 2.25L1.5 9.75L3 11.25Z"
        stroke="#ffaf51"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 3.75L9 5.25"
        stroke="#ffaf51"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 2.25C4.5 2.51522 4.60536 2.76957 4.79289 2.95711C4.98043 3.14464 5.23478 3.25 5.5 3.25C5.23478 3.25 4.98043 3.35536 4.79289 3.54289C4.60536 3.73043 4.5 3.98478 4.5 4.25C4.5 3.98478 4.39464 3.73043 4.20711 3.54289C4.01957 3.35536 3.76522 3.25 3.5 3.25C3.76522 3.25 4.01957 3.14464 4.20711 2.95711C4.39464 2.76957 4.5 2.51522 4.5 2.25Z"
        stroke="#ffaf51"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 7.25C9.5 7.51522 9.60536 7.76957 9.79289 7.95711C9.98043 8.14464 10.2348 8.25 10.5 8.25C10.2348 8.25 9.98043 8.35536 9.79289 8.54289C9.60536 8.73043 9.5 8.98478 9.5 9.25C9.5 8.98478 9.39464 8.73043 9.20711 8.54289C9.01957 8.35536 8.76522 8.25 8.5 8.25C8.76522 8.25 9.01957 8.14464 9.20711 7.95711C9.39464 7.76957 9.5 7.51522 9.5 7.25Z"
        stroke="#ffaf51"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1459_202">
        <rect
          width="12"
          height="12"
          fill="white"
          transform="translate(0 0.75)"
        />
      </clipPath>
    </defs>
  </svg>
);

const Title = styled.h2`
  color: #fff;
  text-align: center;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 120%; /* 48px */
  margin: 0;

  span.yellow {
    color: var(--Yellow, #ffaf51);
  }

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2.5rem;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }
`;

const GridItem = ({ tag, title, description, image, isFirst }) => {
  const Card = styled.div`
    display: flex;
    max-height: 635.75px;
    padding: 2.5rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    ${isFirst && "grid-column: 1 / span 2;"}
    ${isFirst && "flex-direction: row-reverse;"}

    border-radius: 16px;
    background: var(--bg-2, #23242b);
    border: 1px solid #51ffea;

    div {
      flex: 0 1 auto;
    }

    div.content {
      width: 100%;
      ${isFirst && "max-width: 50%;"}
      display: flex;
      flex-direction: column;
      gap: 1rem;

      span.tag {
        color: var(--Yellow, #ffaf51);

        /* Other/CAPS */
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 500;
        line-height: 160%; /* 22.4px */
        text-transform: uppercase;
      }

      h3 {
        color: var(--white-100, #fff);

        /* H3/Large */
        font-size: 1.5rem;
        font-style: normal;
        font-weight: 500;
        line-height: 140%; /* 33.6px */
        margin: 0;
      }

      p {
        color: var(--white-50, rgba(255, 255, 255, 0.7));

        /* Body/Large */
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: 170%; /* 27.2px */
        margin: 0;
      }
    }

    div.image img {
      width: 100%;
      max-width: 600px;
      max-height: 400px;
      height: 100%;
      object-fit: cover;
    }

    @media screen and (max-width: 768px) {
      flex-direction: column;
      div.content {
        max-width: 100%;
      }
    }
  `;
  return (
    <Card>
      <div className="image">
        <img src={image} alt="Item Image" />
      </div>
      <div className="content">
        <span className="tag">{tag}</span>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </Card>
  );
};

const Goals = () => {
  return (
    <GoalsContainer className="container-xl">
      <SectionPill title="Goals" icon={MagicIcon} />
      <Title>
        Primary <span className="yellow">Objectives</span>
      </Title>
      <GridContainer>
        <GridItem
          title="Support Builders"
          tag="Development"
          description="The core mission is to build open-source infrastructure and web applications for everyone. By creating systems to reward useful contributions, we can grow successful projects that solve problems and generate sustainable value."
          image="https://ipfs.near.social/ipfs/bafkreiezfdf2y4zz3nm2dgfhfs2lq3wjuwm647vdn75c3rdwidru4l3ufy"
          isFirst
        />
        <GridItem
          title="Learn Together"
          tag="Education"
          description="We are cultivating a worldwide community of builders who are motivated to help others. Members can earn badges and get necessary resources for training potential contributors."
          image="https://ipfs.near.social/ipfs/bafkreigdor4dtdj5sfq6g2m6wvsfihx72psb7sc5wtx6mbp7g7kxetrpsi"
        />
        <GridItem
          title="Community"
          tag="Facilitate Governance"
          description="We introduced on-chain feedback channels to gather input from participants. This will be crucial for understanding common issues, optimizing documentation, and improving quality of experience."
          image="https://ipfs.near.social/ipfs/bafkreiggevnacu45yy72igqlmq4gkdyea2jj7hswvolonjoqzvifdf57nq"
        />
      </GridContainer>
    </GoalsContainer>
  );
};

return { Goals };
