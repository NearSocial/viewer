const StyledH1 = styled.h1`
  font-family: "Aekonik", sans-serif;
  font-weight: 500;
  font-size: 2rem;
  line-height: 100%;
  letter-spacing: 0;
  color: ${(props) => `${props.textColor}`}
`;

function H1({ children, textColor}) {
  return (
    <StyledH1 textColor={textColor ?? "#FFFFFF"}>
      {children}
    </StyledH1>
  )
}

return { H1 }