const StyledHashtag = styled.span`
  display: flex;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: 4px;
  flex-wrap: wrap;

  border-radius: 2px;
  border: 1px solid var(--Yellow, #ffaf51);

  color: var(--White-100, #fff);

  /* Body/10px */
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  .tag {
    color: var(--Yellow, #ffaf51);
  }
`;
const Hashtag = ({ children }) => {
  return (
    <StyledHashtag>
      <span className="tag">#</span> {children}
    </StyledHashtag>
  );
};

return { Hashtag };
