let theme = props.theme;
let variables = props.variables;

if (!variables) {
  variables = `
    --bg-1: #0B0C14;
    --bg-2: #23242B;
    --white-100: #FFF;
    --white-50: rgba(255, 255, 255, 0.70);
    --yellow: #FFAF51;
    --stroke-color:  rgba(255, 255, 255, 0.2);
    --sea-blue: #51FFEA;
  `;
}

if (!theme) {
  theme = ``;
}

const Root = styled.div`
  ${variables}
  ${theme}
`;

const Container = styled.div`
  display: flex;
  width: 100vw;
  flex-direction: column;
  align-items: flex-start;

  background-color: var(--bg-1);

  overflow-x: hidden;
`;

const Hero = styled.div`
  display: flex;
  width: 100%;
  padding: 150px 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  align-self: stretch;

  text-align: center;
  position: relative;

  // overflow-x: hidden;
`;

const Grid = styled.img`
  position: absolute;
  margin: 0 !important;
  left: 0rem;
  width: 100%;
  object-fit: cover;
  z-index: 0;

  opacity: 0.01;
`;

const Blur = styled.div`
  width: 560px;
  height: 560px;
  position: absolute;
  border-radius: 560px;
  background: rgba(${(props) => props.color}, 0.1);
  filter: blur(129.5px);

  ${(props) =>
    props.position === "left" &&
    `
    left: -216px;
    bottom: -31px;
  `}

  ${(props) =>
    props.position === "right" &&
    `
    right: -216px;
    bottom: -269px;
  `}
`;

const Logo = styled.img`
  width: 138px;
  height: 54px;
`;

const Headline = styled.h1`
  color: var(--white-100);
  max-width: 700px;

  font-size: 48px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;

  white-space: pre-line;
`;

const ColoredText = styled.span`
  color: ${(props) => props.color};
`;

const FrameChild = styled.img`
  height: 100%;
  object-fit: cover;
`;

const Goals = styled.div`
  display: flex;
  padding: 100px 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  align-self: stretch;
`;

const Tag = styled.div`
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 4px;

  border-radius: 100px;
  border: 1px solid var(--yellow);
  background: rgba(255, 189, 52, 0.2);

  color: var(--yellow);
  text-align: center;
  leading-trim: both;
  text-edge: cap;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  text-transform: capitalize;
`;

const SectionHeader = styled.h2`
  max-width: 600px;

  color: var(--white-100);
  text-align: center;

  font-size: 40px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;

  white-space: pre-line;
`;

const SectionSubtitle = styled.div`
  max-width: 500px;

  color: var(--white-50);
  text-align: center;

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

const Objectives = styled.div`
  display: flex;
  max-width: 1200px;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
`;

const ObjectivesTop = styled.div`
  display: flex;
  padding: 40px;
  justify-content: center;
  align-items: center;
  gap: 24px;

  border-radius: 16px;
  border: 1px solid #51ffea;
  background: var(--bg-2);
`;

const ObjectivesTopLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  flex: 1 0 0;
`;

const ObjectiveTitle = styled.div`
  color: var(--yellow);

  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  text-transform: uppercase;
`;

const ObjectiveSubtitle = styled.h3`
  color: var(--white-100);

  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
`;

const ObjectiveBody = styled.div`
  color: var(--white-50);

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%;
`;

const ObjectivesTopRight = styled.div`
  display: flex;
  height: 434px;
  padding: 36px 48.872px 36.231px 49px;
  justify-content: center;
  align-items: center;
  flex: 1 0 0;
`;

const ObjectivesBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
`;

const ObjectiveCard = styled.div`
  display: flex;
  height: 635.75px;
  padding: 40px;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  flex: 1 0 0;

  border-radius: 16px;
  border: 1px solid var(--stroke-color);
  background: var(--bg-2, #23242b);
`;

const ObjectiveImage = styled.div`
  display: flex;
  height: 265px;
  padding: 20.125px 96.964px 20.125px 96px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const EducationImage = styled.div`
  width: 307.036px;
  height: 224.75px;

  border-radius: 14.124px;
  background: url("https://ipfs.near.social/ipfs/bafkreigdor4dtdj5sfq6g2m6wvsfihx72psb7sc5wtx6mbp7g7kxetrpsi"),
    lightgray 50% / contain no-repeat;
`;

const CommunityImage = styled.div`
  width: 307px;
  height: 224.724px;

  border-radius: 14.124px;
  background: url("https://ipfs.near.social/ipfs/bafkreie2iztiiskycciokdlvqxy5z63lq7iac7r72zoybinya6p6yzf6nu"),
    lightgray 50% / contain no-repeat;
`;

const Join = styled.div`
  display: flex;
  padding: 100px 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  align-self: stretch;
`;

const JoinHeading = styled.div`
  display: flex;
  width: 700px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const JoinItems = styled.div`
  display: flex;
  width: 600px;
  height: 312px;
  max-width: 600px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
`;

const JoinItem = styled.div`
  display: flex;
  padding: 12px;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;

  border-radius: 12px;
  border: 1px solid var(--stroke-color);
  background: var(--bg-2);
`;

const JoinItemIcon = styled.div`
  display: flex;
  width: 64px;
  height: 64px;
  padding: 20px;
  justify-content: center;
  align-items: center;

  border-radius: 8px;
  border: 1px solid var(--sea-blue);
`;

const JoinItemBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
  flex: 1 0 0;
`;

const JoinItemTitle = styled.h4`
  color: var(--white-100);

  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const JoinItemSubtitle = styled.h4`
  color: var(--white-50);

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

const HowToJoinContainer = styled.div`
  display: flex;
  max-width: 1200px;
  padding: 40px;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  align-self: stretch;

  border-radius: 16px;
  border: 1px solid var(--sea-blue);
  background: rgba(81, 255, 234, 0.1);
  box-shadow: 4px 24px 48px 0px rgba(81, 255, 234, 0.1);
`;

const HowToJoin = styled.h2`
  max-width: 500px;
  flex: 1 0 0;
  color: var(--white-100);

  font-size: 40px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%; /* 48px */
`;

const HowToJoinRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  flex: 1 0 0;
`;

const HowToJoinInstructions = styled.div`
  color: var(--sea-blue);

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

const JoinButton = styled.div`
  display: flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 4px;

  border-radius: 8px;
  background: var(--yellow);
`;

const Governance = styled.div`
  display: flex;
  padding: 100px 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  align-self: stretch;
`;

const GovernanceImage = styled.img`
  height: 447px;
  max-width: 1200px;
`;

const CTA = styled.div`
  postition: relative;
  display: flex;
  height: 816px;
  padding: 100px 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  align-self: stretch;
`;

const CTAWrapper = styled.div`
  display: flex;
  width: 600px;
  padding: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;

  border-radius: 16px;
  border: 1px solid #51b6ff;
  background: var(--black-100);
  box-shadow: 4px 24px 48px 0px rgba(255, 189, 52, 0.1);
`;

const CTABody = styled.h1`
  color: var(--white-100);
  text-align: center;

  font-size: 48px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%; /* 57.6px */
`;

const Footer = styled.div`
  display: flex;
  padding: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  align-self: stretch;
`;

const Socials = styled.div`
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  gap: 12px;
  flex-wrap: wrap;
`;

const FooterReserved = styled.div`
  color: var(--white-50);
  text-align: center;

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

return (
  <Root>
    <Container>
      <Hero>
        <Grid
          src="https://ipfs.near.social/ipfs/bafkreiay3ytllrxhtyunppqxcazpistttwdzlz3jefdbsq5tosxuryauu4"
          alt="grid"
        />
        <Logo
          src={
            "https://ipfs.near.social/ipfs/bafkreihbwho3qfvnu4yss3eh5jrx6uxhrlzdgtdjyzyjrpa6odro6wdxya"
          }
          alt="Build DAO"
        />
        <Headline>
          {`Designed to connect and empower builders in a `}
          <ColoredText color={"var(--white-50)"}>
            multi-chain ecosystem
          </ColoredText>
        </Headline>
        <Blur color="81, 182, 255" position="left" />
        <Blur color="255, 175, 81" position="right" />
      </Hero>
      <Goals>
        <Tag>
          Goals{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="12"
            viewBox="0 0 13 12"
            fill="none"
          >
            <g clip-path="url(#clip0_1459_196)">
              <path
                d="M3.5 10.5L11 3L9.5 1.5L2 9L3.5 10.5Z"
                stroke="#FFAF51"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 3L9.5 4.5"
                stroke="#FFAF51"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5 1.5C5 1.76522 5.10536 2.01957 5.29289 2.20711C5.48043 2.39464 5.73478 2.5 6 2.5C5.73478 2.5 5.48043 2.60536 5.29289 2.79289C5.10536 2.98043 5 3.23478 5 3.5C5 3.23478 4.89464 2.98043 4.70711 2.79289C4.51957 2.60536 4.26522 2.5 4 2.5C4.26522 2.5 4.51957 2.39464 4.70711 2.20711C4.89464 2.01957 5 1.76522 5 1.5Z"
                stroke="#FFAF51"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 6.5C10 6.76522 10.1054 7.01957 10.2929 7.20711C10.4804 7.39464 10.7348 7.5 11 7.5C10.7348 7.5 10.4804 7.60536 10.2929 7.79289C10.1054 7.98043 10 8.23478 10 8.5C10 8.23478 9.89464 7.98043 9.70711 7.79289C9.51957 7.60536 9.26522 7.5 9 7.5C9.26522 7.5 9.51957 7.39464 9.70711 7.20711C9.89464 7.01957 10 6.76522 10 6.5Z"
                stroke="#FFAF51"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_1459_196">
                <rect
                  width="12"
                  height="12"
                  fill="white"
                  transform="translate(0.5)"
                />
              </clipPath>
            </defs>
          </svg>
        </Tag>
        <SectionHeader>
          Primary <ColoredText color={"var(--yellow)"}>Objectives</ColoredText>
        </SectionHeader>
        <Objectives>
          <ObjectivesTop>
            <ObjectivesTopLeft>
              <ObjectiveTitle>Development</ObjectiveTitle>
              <ObjectiveSubtitle>Support builders</ObjectiveSubtitle>
              <ObjectiveBody>
                {`The core mission is to build open-source infrastructure and web applications for everyone. By creating systems to reward useful contributions, we can grow successful projects that solve problems and generate sustainable value.`}
              </ObjectiveBody>
            </ObjectivesTopLeft>
            <ObjectivesTopRight>
              <FrameChild
                alt="development"
                src="https://ipfs.near.social/ipfs/bafkreiezfdf2y4zz3nm2dgfhfs2lq3wjuwm647vdn75c3rdwidru4l3ufy"
              />
            </ObjectivesTopRight>
          </ObjectivesTop>
          <ObjectivesBottom>
            <ObjectiveCard>
              <ObjectiveImage>
                <FrameChild
                  src="https://ipfs.near.social/ipfs/bafkreigdor4dtdj5sfq6g2m6wvsfihx72psb7sc5wtx6mbp7g7kxetrpsi"
                  alt="education"
                />
              </ObjectiveImage>
              <ObjectiveTitle>Education</ObjectiveTitle>
              <ObjectiveSubtitle>Learn together</ObjectiveSubtitle>
              <ObjectiveBody>
                {`We are cultivating a worldwide community of builders who are motivated to help others. Members can earn badges and get necessary resources for training potential contributors.`}
              </ObjectiveBody>
            </ObjectiveCard>
            <ObjectiveCard>
              <ObjectiveImage>
                <FrameChild
                  src="https://ipfs.near.social/ipfs/bafkreie2iztiiskycciokdlvqxy5z63lq7iac7r72zoybinya6p6yzf6nu"
                  alt="education"
                />
              </ObjectiveImage>
              <ObjectiveTitle>Community</ObjectiveTitle>
              <ObjectiveSubtitle>Facilitate Governance</ObjectiveSubtitle>
              <ObjectiveBody>
                {`We introduced on-chain feedback channels to gather input from participants. This will be crucial for understanding common issues, optimizing documentation, and improving quality of experience.`}
              </ObjectiveBody>
            </ObjectiveCard>
          </ObjectivesBottom>
        </Objectives>
      </Goals>
      <Join>
        <JoinHeading>
          <Tag>
            Join{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
            >
              <g clip-path="url(#clip0_1459_196)">
                <path
                  d="M3.5 10.5L11 3L9.5 1.5L2 9L3.5 10.5Z"
                  stroke="#FFAF51"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 3L9.5 4.5"
                  stroke="#FFAF51"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 1.5C5 1.76522 5.10536 2.01957 5.29289 2.20711C5.48043 2.39464 5.73478 2.5 6 2.5C5.73478 2.5 5.48043 2.60536 5.29289 2.79289C5.10536 2.98043 5 3.23478 5 3.5C5 3.23478 4.89464 2.98043 4.70711 2.79289C4.51957 2.60536 4.26522 2.5 4 2.5C4.26522 2.5 4.51957 2.39464 4.70711 2.20711C4.89464 2.01957 5 1.76522 5 1.5Z"
                  stroke="#FFAF51"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10 6.5C10 6.76522 10.1054 7.01957 10.2929 7.20711C10.4804 7.39464 10.7348 7.5 11 7.5C10.7348 7.5 10.4804 7.60536 10.2929 7.79289C10.1054 7.98043 10 8.23478 10 8.5C10 8.23478 9.89464 7.98043 9.70711 7.79289C9.51957 7.60536 9.26522 7.5 9 7.5C9.26522 7.5 9.51957 7.39464 9.70711 7.20711C9.89464 7.01957 10 6.76522 10 6.5Z"
                  stroke="#FFAF51"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1459_196">
                  <rect
                    width="12"
                    height="12"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </Tag>
          <SectionHeader>
            {`Open call for members to `}
            <ColoredText color={"var(--sea-blue)"}>
              join and contribute
            </ColoredText>
          </SectionHeader>
          <SectionSubtitle>
            Build DAO is an innovative, community-led organization intended to
            serve the open web ecosystem in multiple ways:
          </SectionSubtitle>
        </JoinHeading>
        <JoinItems>
          <JoinItem>
            <JoinItemIcon>
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
            </JoinItemIcon>
            <JoinItemBody>
              <JoinItemTitle>Vote on Important Decisions</JoinItemTitle>
              <JoinItemSubtitle>
                Members collectively shape community programs and policies.
              </JoinItemSubtitle>
            </JoinItemBody>
          </JoinItem>
          <JoinItem>
            <JoinItemIcon>
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
            </JoinItemIcon>
            <JoinItemBody>
              <JoinItemTitle>Earn Recognition and Rewards</JoinItemTitle>
              <JoinItemSubtitle>
                Members develop their own reputations as builders.
              </JoinItemSubtitle>
            </JoinItemBody>
          </JoinItem>
          <JoinItem>
            <JoinItemIcon>
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
            </JoinItemIcon>
            <JoinItemBody>
              <JoinItemTitle>Discover Opportunities</JoinItemTitle>
              <JoinItemSubtitle>
                Members gain exposure to new gigs and interesting projects.
              </JoinItemSubtitle>
            </JoinItemBody>
          </JoinItem>
        </JoinItems>
        <HowToJoinContainer>
          <HowToJoin>How to Join</HowToJoin>
          <HowToJoinRight>
            <HowToJoinInstructions>
              <ol>1. Sign membership agreement (on-chain)</ol>
              <ol>2. Propose to be added to the “Community” role</ol>
              <ol>3. Fulfill contribution requirements</ol>
            </HowToJoinInstructions>
            <JoinButton>Join</JoinButton>
          </HowToJoinRight>
        </HowToJoinContainer>
      </Join>
      <Governance>
        <JoinHeading>
          <Tag>
            Goverance{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
            >
              <g clip-path="url(#clip0_1459_196)">
                <path
                  d="M3.5 10.5L11 3L9.5 1.5L2 9L3.5 10.5Z"
                  stroke="#FFAF51"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 3L9.5 4.5"
                  stroke="#FFAF51"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 1.5C5 1.76522 5.10536 2.01957 5.29289 2.20711C5.48043 2.39464 5.73478 2.5 6 2.5C5.73478 2.5 5.48043 2.60536 5.29289 2.79289C5.10536 2.98043 5 3.23478 5 3.5C5 3.23478 4.89464 2.98043 4.70711 2.79289C4.51957 2.60536 4.26522 2.5 4 2.5C4.26522 2.5 4.51957 2.39464 4.70711 2.20711C4.89464 2.01957 5 1.76522 5 1.5Z"
                  stroke="#FFAF51"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10 6.5C10 6.76522 10.1054 7.01957 10.2929 7.20711C10.4804 7.39464 10.7348 7.5 11 7.5C10.7348 7.5 10.4804 7.60536 10.2929 7.79289C10.1054 7.98043 10 8.23478 10 8.5C10 8.23478 9.89464 7.98043 9.70711 7.79289C9.51957 7.60536 9.26522 7.5 9 7.5C9.26522 7.5 9.51957 7.39464 9.70711 7.20711C9.89464 7.01957 10 6.76522 10 6.5Z"
                  stroke="#FFAF51"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1459_196">
                  <rect
                    width="12"
                    height="12"
                    fill="white"
                    transform="translate(0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </Tag>
          <SectionHeader>Let's coordinate!</SectionHeader>
          <SectionSubtitle>
            {`Build DAO upholds the principles of openness and accountability in its decision-making processes. We believe success depends on metagovernance of builders, by builders, for builders.`}
          </SectionSubtitle>
        </JoinHeading>
        <GovernanceImage
          src="https://ipfs.near.social/ipfs/bafybeifaeuepgsffn32kjsaboqrnruv7blhfy2mwe74yvjuo4vggeppr3y"
          alt="governance"
        />
      </Governance>
      <CTA>
        <Grid
          src="https://ipfs.near.social/ipfs/bafkreiay3ytllrxhtyunppqxcazpistttwdzlz3jefdbsq5tosxuryauu4"
          alt="grid"
        />
        <CTAWrapper>
          <Logo
            src={
              "https://ipfs.near.social/ipfs/bafkreihbwho3qfvnu4yss3eh5jrx6uxhrlzdgtdjyzyjrpa6odro6wdxya"
            }
            alt="Build DAO"
          />
          <CTABody>Together, we can build a better future.</CTABody>
          <JoinButton>Join</JoinButton>
        </CTAWrapper>
        <Blur color="81, 182, 255" position="left" />
        <Blur color="255, 175, 81" position="right" />
      </CTA>
      <Footer>
        <Socials></Socials>
        <FooterReserved>@2023 BuildDAO all rights reserved</FooterReserved>
      </Footer>
    </Container>
  </Root>
);
