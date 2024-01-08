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
  flex-shrink: 0;
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

const Aside = (props) => {
  return (
    <Container>
      {Object.keys(props.routes || {}).map((route) => (
        <TabButton
          className={props.active === route && "active"}
          onClick={() => props.setActiveRoute(route)}
        >
          <i className={`bi ${props.routes[route].icon}`}></i>
          {props.routes[route].label}
        </TabButton>
      ))}
    </Container>
  );
};

return { Aside };
