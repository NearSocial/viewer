const StyledH2 = styled.h2`
  font-family: "Aekonik", sans-serif;
  font-weight: 500;
  font-size: 1.625rem;
  line-height: 120%;
  letter-spacing: 0;
  color: ${(props) => `${props.textColor}`}
`;

function H2({ children, textColor }) {
  return (
    <StyledH2 textColor={textColor ?? "#FFFFFF"}>
      {children}
    </StyledH2>
  )
}

return { H2 }