const StyledParagraph = styled.p`
  font-family: "Aekonik", sans-serif;
  font-weight: 500;
  letter-spacing: 0;
  color: ${(props) => `${props.textColor}`};
  font-size: ${(props) => {
    switch (props.pType) {
      case "p1":
        return "1rem";
      case "p2":
        return "0.875rem";
      case "p3":
        return "0.8125rem";
      default:
        return "";
    }
  }};
  line-height: ${(props) => {
    switch (props.pType) {
      case "p1":
        return "170%";
      case "p2":
        return "170%";
      case "p3":
        return "auto";
      default:
        return "";
    }
  }};
`;

function P({ children, pType, textColor }) {
  const defaults = {
    pType: pType ?? "p1",
    textColor: textColor ?? "#000000",
  };

  return (
    <StyledParagraph pType={defaults.pType} textColor={defaults.textColor}>
      {children}
    </StyledParagraph>
  );
}

return { P };
