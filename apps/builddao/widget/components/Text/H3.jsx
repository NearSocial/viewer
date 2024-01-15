const StyledH3 = styled.h3`
  font-family: "Aekonik", sans-serif;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 140%;
  letter-spacing: 0;
  color: ${(props) => `${props.textColor}`}
`;

function H3({ children, textColor = "#FFFFFF" }) {
  return (
    <StyledH3 textColor={textColor}>
      {children}
    </StyledH3>
  )
}

return { H3 }