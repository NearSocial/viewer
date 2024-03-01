const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3.125rem;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  align-self: stretch;
  background-color: #0b0c14;
  width: 100%;

  p {
    max-width: 700px;

    align-self: stretch;

    color: var(--white-50, rgba(255, 255, 255, 0.7));
    text-align: center;

    /* Body/Large */
    font-family: Satoshi, sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 170%; /* 27.2px */
    margin: 0 auto;
  }
`;

const XIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
  >
    <path
      d="M8 2.75H1L9.26086 13.7645L1.44995 22.7499H4.09998L10.4883 15.401L16 22.75H23L14.3917 11.2723L21.8001 2.75H19.1501L13.1643 9.63578L8 2.75ZM17 20.75L5 4.75H7L19 20.75H17Z"
      fill="white"
    />
  </svg>
);

const TelegramIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="24"
    height="25"
    viewBox="0 0 256 256"
  >
    <g
      fill="#ffffff"
      fillRule="nonzero"
      stroke="none"
      strokeWidth="1"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeMiterlimit="10"
      strokeDasharray=""
      strokeDashoffset="0"
      fontFamily="none"
      fontWeight="none"
      fontSize="none"
      textAnchor="none"
      style={{ mixBlendMode: "normal" }}
    >
      <g transform="scale(5.12,5.12)">
        <path d="M46.137,6.552c-0.75,-0.636 -1.928,-0.727 -3.146,-0.238h-0.002c-1.281,0.514 -36.261,15.518 -37.685,16.131c-0.259,0.09 -2.521,0.934 -2.288,2.814c0.208,1.695 2.026,2.397 2.248,2.478l8.893,3.045c0.59,1.964 2.765,9.21 3.246,10.758c0.3,0.965 0.789,2.233 1.646,2.494c0.752,0.29 1.5,0.025 1.984,-0.355l5.437,-5.043l8.777,6.845l0.209,0.125c0.596,0.264 1.167,0.396 1.712,0.396c0.421,0 0.825,-0.079 1.211,-0.237c1.315,-0.54 1.841,-1.793 1.896,-1.935l6.556,-34.077c0.4,-1.82 -0.156,-2.746 -0.694,-3.201zM22,32l-3,8l-3,-10l23,-17z"></path>
      </g>
    </g>
  </svg>
);

const GitHubIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="white"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-1.01-.01-1.84-2.78.61-3.37-1.35-3.37-1.35-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.9 1.54 2.36 1.1 2.94.84.09-.65.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.26.1-2.63 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.38.1 2.63.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.76 0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
  </svg>
);

const NearSocialIcon = (
  <svg
    width="29"
    height="20"
    viewBox="0 0 29 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.55396 17.509L2 9.99996L9.55396 2.49097"
      stroke="#ffffff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.536 2.49097L27 9.99996L19.536 17.509"
      stroke="#ffffff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SocialContainer = styled.div`
  display: flex;
  gap: 1.25rem;
  align-items: center;
`;

const Footer = () => {
  const date = new Date();

  return (
    <Container>
      <SocialContainer>
        <a href="https://twitter.com/nearbuilders" target="_blank">
          {XIcon}
        </a>
        <a href="https://nearbuilders.com/tg-builders" target="_blank">
          {TelegramIcon}
        </a>
        <a href="https://github.com/nearbuilders" target="_blank">
          {GitHubIcon}
        </a>
        <a href="https://devs.near.social" target="_blank">
          {NearSocialIcon}
        </a>
      </SocialContainer>
      <p>{date.getFullYear()} | Build DAO</p>
    </Container>
  );
};

return { Footer };
