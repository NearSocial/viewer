const { theme } = VM.require("rambo-dev.near/widget/ThemeProvider");

const StyledBullet = styled.div`
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  font-family: Aeonik, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
   ${({ variant, theme }) => {
     const isDefault = variant === "default";

     const background = isDefault
       ? theme.colors.blue500
       : theme.colors.seablue500;
     const color = isDefault ? theme.colors.blue500 : theme.colors.seablue500;
     const border = `1px solid ${background}33`;

     return `
      background: ${background}33;
      color: ${color};
      border: ${border};
    `;
   }}
`;

function Bullet({ children, variant }) {
  const defaultVariant = variant || "default";

  return (
    <StyledBullet theme={theme} variant={defaultVariant}>
      {children}
    </StyledBullet>
  );
}

return { Bullet };