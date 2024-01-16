const StyledH4 = styled.h4`
  font-family: "Aekonik", sans-serif;
  font-weight: 500;
  font-size: 1.125rem;
  line-height: 160%;
  letter-spacing: 0;
  color: ${(props) => `${props.textColor}`}
`;

function H4({ children, textColor }) {
  return (
    <StyledH4 textColor={textColor ?? "#FFFFFF"}>
      {children}
    </StyledH4>
  )
}

return { H4 }