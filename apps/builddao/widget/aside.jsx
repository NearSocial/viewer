const UpdateIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.99992 2.66667C6.16754 2.66667 4.54997 3.59084 3.58954 5H5.33325V6.33333H1.33325V2.33333H2.66659V3.99957C3.88246 2.38111 5.81835 1.33333 7.99992 1.33333C11.6818 1.33333 14.6666 4.3181 14.6666 8H13.3333C13.3333 5.05448 10.9455 2.66667 7.99992 2.66667ZM2.66659 8C2.66659 10.9455 5.0544 13.3333 7.99992 13.3333C9.83232 13.3333 11.4499 12.4091 12.4103 11H10.6666V9.66667H14.6666V13.6667H13.3333V12.0004C12.1174 13.6189 10.1815 14.6667 7.99992 14.6667C4.31802 14.6667 1.33325 11.6819 1.33325 8H2.66659Z"
      fill="white"
    />
  </svg>
);

const BugIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.66658 13.2667C10.1881 12.9578 11.3333 11.6127 11.3333 10V8C11.3333 7.53267 11.2375 7.08127 11.0563 6.66667H4.94351C4.76231 7.08127 4.66658 7.53267 4.66658 8V10C4.66658 11.6127 5.81176 12.9578 7.33325 13.2667V9.33333H8.66658V13.2667ZM3.69045 11.7938C3.46033 11.2415 3.33325 10.6356 3.33325 10H1.33325V8.66667H3.33325V8C3.33325 7.57153 3.39099 7.15653 3.49912 6.7624L2.02385 5.91068L2.69052 4.75598L4.03749 5.53366C4.07989 5.46569 4.12398 5.3989 4.16971 5.33333H11.8301C11.8759 5.3989 11.9199 5.46569 11.9623 5.53366L13.3093 4.75598L13.976 5.91068L12.5007 6.7624C12.6089 7.15653 12.6666 7.57153 12.6666 8V8.66667H14.6666V10H12.6666C12.6666 10.6356 12.5395 11.2415 12.3094 11.7938L13.976 12.756L13.3093 13.9107L11.6255 12.9385C10.7699 13.9929 9.46358 14.6667 7.99992 14.6667C6.53627 14.6667 5.23 13.9929 4.37439 12.9385L2.69052 13.9107L2.02385 12.756L3.69045 11.7938ZM5.33325 4C5.33325 2.52724 6.52716 1.33333 7.99992 1.33333C9.47265 1.33333 10.6666 2.52724 10.6666 4H5.33325Z"
      fill="white"
      fill-opacity="0.7"
    />
  </svg>
);

const ResourceIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.27605 3.33333H13.9999C14.3681 3.33333 14.6666 3.63181 14.6666 4V13.3333C14.6666 13.7015 14.3681 14 13.9999 14H1.99992C1.63173 14 1.33325 13.7015 1.33325 13.3333V2.66667C1.33325 2.29848 1.63173 2 1.99992 2H6.94272L8.27605 3.33333ZM2.66659 3.33333V12.6667H13.3333V4.66667H7.72378L6.39044 3.33333H2.66659ZM5.33325 8H10.6666V9.33333H5.33325V8Z"
      fill="white"
      fill-opacity="0.7"
    />
  </svg>
);

const Container = styled.div`
  border-radius: 16px;
  border: 1px solid var(--Stroke-color, rgba(255, 255, 255, 0.2));
  background: var(--bg-1, #0b0c14);
  width: 100%;
  height: 100%;

  display: flex;
  padding: 24px 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  @media screen and (max-width: 768px) {
    border: 0px;
    flex-direction: row;
    overflow-x: auto;
  }
`;

const TabButton = styled.button`
  all: unset;
  display: flex;
  padding: 8px 12px;
  align-items: center;
  gap: 10px;
  align-self: stretch;

  @media screen and (max-width: 768px) {
    align-self: auto;
  }

  border-radius: 8px;
  border: 1px solid var(--Stroke-color, rgba(255, 255, 255, 0.2));

  color: var(--white-50, rgba(255, 255, 255, 0.7));

  /* Body/14px */
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 23.8px */

  transition: all 300ms;

  &:hover,
  &:active,
  &.active {
    border-radius: 8px;
    background: var(--Yellow, #ffaf51) !important;

    color: var(--black-100, #000) !important;
    cursor: pointer;

    /* Body/14px */
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 170%; /* 23.8px */

    svg {
      filter: invert(1);
    }
  }
`;

function capitalize (s) {
  return s
    .split(' ')
    .map(word => `${word.slice(0,1).toUpperCase()}${word.slice(1)}`)
    .reduce((phrase, word) => `${phrase} ${word}`)
}

return (
  <Container>
    { props.feeds.map((name) => (
      <TabButton
        className={props.currentFeed === name && "active"}
        onClick={() => props.setCurrentFeed(name)}
      >
        {UpdateIcon} {capitalize(name)}
      </TabButton>
    ))}
  </Container>
);
