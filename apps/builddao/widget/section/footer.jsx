const Footer = styled.div`
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
    font-family: Satoshi;
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
      style={{ "mix-blend-mode": "normal" }}
    >
      <g transform="scale(5.12,5.12)">
        <path d="M46.137,6.552c-0.75,-0.636 -1.928,-0.727 -3.146,-0.238h-0.002c-1.281,0.514 -36.261,15.518 -37.685,16.131c-0.259,0.09 -2.521,0.934 -2.288,2.814c0.208,1.695 2.026,2.397 2.248,2.478l8.893,3.045c0.59,1.964 2.765,9.21 3.246,10.758c0.3,0.965 0.789,2.233 1.646,2.494c0.752,0.29 1.5,0.025 1.984,-0.355l5.437,-5.043l8.777,6.845l0.209,0.125c0.596,0.264 1.167,0.396 1.712,0.396c0.421,0 0.825,-0.079 1.211,-0.237c1.315,-0.54 1.841,-1.793 1.896,-1.935l6.556,-34.077c0.4,-1.82 -0.156,-2.746 -0.694,-3.201zM22,32l-3,8l-3,-10l23,-17z"></path>
      </g>
    </g>
  </svg>
);

const SocialContainer = styled.div`
  display: flex;
  gap: 1.25rem;
  align-items: center;
`;

const date = new Date();

return (
  <Footer>
    <SocialContainer>
      <a href="https://twitter.com/nearbuilders" target="_blank">
        {XIcon}
      </a>
      <a href="https://nearbuilders.com/tg-builders" target="_blank">
        {TelegramIcon}
      </a>
    </SocialContainer>
    <p>{date.getFullYear()} BuildDAO all rights reserved</p>
  </Footer>
);
