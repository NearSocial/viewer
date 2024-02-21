function Avatar(props) {
  const accountId = props.accountId ?? context.accountId;

  const ImageWrapper = styled.div`
    img {
      width: ${(props) =>
        props.variant === "mobile" ? "40px" : props.size ?? "52px"} !important;
      height: ${(props) =>
        props.variant === "mobile" ? "40px" : props.size ?? "52px"} !important;
      flex-shrink: 0 !important;
      border-radius: 100px !important;
    }

    .profile-image {
      width: auto !important;
      height: auto !important;
    }

    @media screen and (max-width: 768px) {
      ${(props) =>
        !props.variant &&
        `
      img {
        width: ${props.size ?? "40px"} !important;
        height: ${props.size ?? "40px"} !important;
      }
    `}
    }
  `;

  return (
    <ImageWrapper variant={props.variant} size={props.size} style={props.style}>
      <Widget src="mob.near/widget/ProfileImage" props={{ accountId }} />
    </ImageWrapper>
  );
}

return { Avatar };
