const StyledLink = styled.a`
  all: unset;
  display: inline-flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  font: 500 14px / normal;
  transition: all 300ms;

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
        return "transparent";
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

  /* Hover states */
  &:hover {
    background: ${(props) => {
      switch (props.variant) {
        case "primary":
          return "#e49b48";
        case "outline":
          return "rgba(255, 255, 255, 0.20)";
        default:
          return "#17181c";
      }
    }};
  }
`;

function ButtonLink({ id, children, variant, type, href, className, style }) {
  return (
    <StyledLink
      id={id}
      key={`ButtonLink-${type ?? "Normal"}-${variant ?? "Default"}-${id}`}
      className={className}
      variant={variant}
      type={type}
      style={style}
      href={href}
    >
      {children}
    </StyledLink>
  );
}

return { ButtonLink };
