const StyledButton = styled.button`
  all: unset;
  display: inline-flex;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  font-family: "Poppins", sans-serif;

  transition: all 300ms;

  ${(props) =>
    props.type === "icon" &&
    `
    display: flex;
    width: 40px;
    height: 40px;
    padding: 0px;
    flex-shrink: 0;
    font-size: 16px;
    border-radius: 50%;
  `}

  /* Colors based on variant prop */
  background: ${(props) => {
    switch (props.variant) {
      case "primary":
        return "var(--button-primary-bg, #eca227)";
      case "outline":
        return "var(--button-outline-bg, transparent)";
      case "secondary":
        return "var(--button-secondary-bg, #23242B)";
      default:
        return "var(--button-default-bg, #23242B)";
    }
  }};

  color: ${(props) => {
    switch (props.variant) {
      case "primary":
        return "var(--button-primary-color, #000)";
      case "outline":
        return "var(--button-outline-color, #fff)";
      case "secondary":
        return "var(--button-secondary-color, #CDD0D5)";
      default:
        return "var(--button-default-color, #CDD0D5)";
    }
  }};

  border: ${(props) =>
    props.variant === "outline"
      ? "1px solid var(--stroke-color, rgba(255, 255, 255, 0.20))"
      : ""};

  /* Hover states */
  &:hover:not(:disabled) {
    background: ${(props) => {
      switch (props.variant) {
        case "primary":
          return "var(--button-primary-hover-bg, #e49b48)";
        case "outline":
          return "var(--button-outline-hover-bg, rgba(255, 255, 255, 0.20))";
        default:
          return "var(--button-default-hover-bg, #17181c)";
      }
    }};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed !important;
  }
`;

function Button({
  id,
  disabled,
  loading,
  children,
  variant,
  type,
  onClick,
  className,
  target,
  linkClassName,
  href,
  noLink,
  style,
}) {
  className = className + (disabled ? " disabled" : "");
  if (href && noLink) {
    return (
      <a
        href={href}
        className={linkClassName}
        style={{ textDecoration: "none" }}
        target={target}
      >
        <StyledButton
          id={id}
          key={`ButtonLink-${type ?? "Normal"}-${variant ?? "Default"}-${id}`}
          className={className}
          variant={variant}
          disabled={disabled}
          type={type}
          style={style}
          href={href}
        >
          {children}
        </StyledButton>
      </a>
    );
  }

  if (href) {
    return (
      <Link
        to={href}
        className={linkClassName}
        style={{ textDecoration: "none" }}
        target={target}
      >
        <StyledButton
          id={id}
          key={`ButtonLink-${type ?? "Normal"}-${variant ?? "Default"}-${id}`}
          className={className}
          disabled={disabled}
          variant={variant}
          type={type}
          style={style}
          href={href}
        >
          {children}
        </StyledButton>
      </Link>
    );
  }

  return (
    <StyledButton
      id={id}
      disabled={disabled}
      key={`Button-${type ?? "Normal"}-${variant ?? "Default"}-${id}`}
      className={className}
      variant={variant}
      type={type}
      style={style}
      onClick={onClick}
    >
      {children}
      {loading ? (
        <span
          className="spinner-border spinner-border-sm mr-2"
          role="status"
          aria-hidden="true"
        ></span>
      ) : null}
    </StyledButton>
  );
}

return { Button };
