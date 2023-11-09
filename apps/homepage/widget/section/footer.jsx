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
    </SocialContainer>
    <p>{date.getFullYear()} BuildDAO all rights reserved</p>
  </Footer>
);
