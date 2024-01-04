const StyledButton = styled.button`
  all: unset;
  display: inline-flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  font: 500 14px / normal;

  ${(props) =>
    props.type === "icon" &&
    `
    display: flex;
    width: 40px;
    height: 40px;
    padding: 5px;
    flex-shrink: 0;
    border-radius: 50%;
  `}

  /* Colors based on variant prop */
  background: ${(props) => {
    switch (props.variant) {
      case "primary":
        return "#FFAF51";
      case "outline":
        return "#0b0c14";
      default:
        return "#23242B";
    }
  }};

  color: ${(props) => {
    switch (props.variant) {
      case "primary":
        return "#000";
      case "outline":
        return "#fff";
      default:
        return "#CDD0D5";
    }
  }};

  border: ${(props) =>
    props.variant === "outline" ? "1px solid rgba(255, 255, 255, 0.20)" : ""};
`;

function Button({ id, children, variant, type, onClick, className, style }) {
  return (
    <StyledButton
      id={id}
      key={`Button-${type ?? "Normal"}-${variant ?? "Default"}`}
      className={className}
      variant={variant}
      type={type}
      style={style}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}

return { Button };
