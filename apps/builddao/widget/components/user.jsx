const { Avatar } = VM.require("buildhub.near/widget/components.avatar");

const Wrapper = styled.div`
  p {
    color: #fff;
    color: var(--White-100, #fff);

    font-size: ${(props) => (props.variant === "mobile" ? "13px" : "14px")};
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin: 0;
  }

  p.username {
    color: var(--White-50, #cdd0d5);
    font-size: ${(props) => (props.variant === "mobile" ? "10px" : "13px")};
  }

  p.time {
    color: var(--White-100, #fff);
    font-size: ${(props) => (props.variant === "mobile" ? "10px" : "13px")};
  }
`;

function User(props) {
  const accountId = props.accountId ?? context.accountId;
  const { name: profileName } =
    props.profile ?? Social.getr(`${accountId}/profile`);
  const timeAgo = props.timeAgo;

  return (
    <div className="d-flex gap-1">
      <Avatar variant={props.variant} accountId={accountId} />
      <Wrapper variant={props.variant} className="d-flex gap-1 flex-column">
        <p>{profileName || "No-Name Profile"}</p>
        <p className="username">{accountId}</p>
        {timeAgo && <p className="time">{timeAgo}</p>}
      </Wrapper>
    </div>
  );
}

return { User };
