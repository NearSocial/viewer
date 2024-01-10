const { theme } = VM.require("rambo-dev.near/widget/ThemeProvider");

const StyledBullet = styled.div`
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  background: ${(props) => `${props.colors.seablue500}33`};
  color: ${(props) => props.colors.seablue500};
  border: 1px solid ${(props) => `${props.colors.seablue500}33`};
  font-family: Satoshi, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
`;

function Bullet({ children }) {
  return <StyledBullet {...theme}>{children}</StyledBullet>;
}

return { Bullet };