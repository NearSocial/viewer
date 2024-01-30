const imageLink =
  "https://ipfs.near.social/ipfs/bafybeifaeuepgsffn32kjsaboqrnruv7blhfy2mwe74yvjuo4vggeppr3y";

const SectionPill = ({ title, icon }) => {
  const Pill = styled.div`
    display: flex;
    padding: 8px 12px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border-radius: 100px;
    border: 1px solid var(--Blue, #51b6ff);
    background: rgba(81, 182, 255, 0.2);

    color: var(--Blue, #51b6ff);
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
        stroke="#51B6FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 3.75L9 5.25"
        stroke="#51B6FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 2.25C4.5 2.51522 4.60536 2.76957 4.79289 2.95711C4.98043 3.14464 5.23478 3.25 5.5 3.25C5.23478 3.25 4.98043 3.35536 4.79289 3.54289C4.60536 3.73043 4.5 3.98478 4.5 4.25C4.5 3.98478 4.39464 3.73043 4.20711 3.54289C4.01957 3.35536 3.76522 3.25 3.5 3.25C3.76522 3.25 4.01957 3.14464 4.20711 2.95711C4.39464 2.76957 4.5 2.51522 4.5 2.25Z"
        stroke="#51B6FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 7.25C9.5 7.51522 9.60536 7.76957 9.79289 7.95711C9.98043 8.14464 10.2348 8.25 10.5 8.25C10.2348 8.25 9.98043 8.35536 9.79289 8.54289C9.60536 8.73043 9.5 8.98478 9.5 9.25C9.5 8.98478 9.39464 8.73043 9.20711 8.54289C9.01957 8.35536 8.76522 8.25 8.5 8.25C8.76522 8.25 9.01957 8.14464 9.20711 7.95711C9.39464 7.76957 9.5 7.51522 9.5 7.25Z"
        stroke="#51B6FF"
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

const GovernanceContainer = styled.div`
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

  img {
    max-height: 447px;
    width: 100%;
  }
`;

const ContentContainer = styled.div`
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
    color: #51b6ff;
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

  @media screen and (max-widht: 768px) {
    h2 {
      font-size: 1.5rem;
    }

    p {
      font-size: 0.875rem;
    }
  }
`;

const Image = styled.img`
  max-width: 1200px;
`;

const Governance = () => {
  return (
    <GovernanceContainer>
      <ContentContainer>
        <SectionPill title="Governance" icon={MagicIcon} />
        <h1>
          Let's <span className="blue">coordinate!</span>
        </h1>
        <p>
          Build DAO upholds the principles of openness and accountability in its
          decision-making processes. We believe success depends on
          metagovernance of builders, by builders, for builders.
        </p>
      </ContentContainer>
      <Image src={imageLink} />
    </GovernanceContainer>
  );
};

return { Governance };
