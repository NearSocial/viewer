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
  const blockHeight = props.blockHeight;
  const pinned = !!props.pinned;
  const postType = props.postType ?? "post";
  const link = props.link;
  const isPremium = !!props.isPremium;

  const Overlay = (props) => (
    <a
      className="link-dark text-truncate d-inline-flex mw-100"
      href={`/mob.near/widget/ProfilePage?accountId=${accountId}`}
    >
      <Widget
        src="mob.near/widget/Profile.N.OverlayTrigger"
        loading={props.children}
        props={{
          accountId,
          children: props.children,
        }}
      />
    </a>
  );

  return (
    <Overlay>
      <div className="d-flex gap-1">
        <Avatar variant={props.variant} accountId={accountId} />
        <Wrapper variant={props.variant} className="d-flex gap-1 flex-column">
          <div className="d-flex align-items-center gap-1">
            <p>{profileName || "No-Name Profile"}</p>

            <div className="flex-shrink-0">
              <Widget
                loading={""}
                src="mob.near/widget/Checkmark"
                props={{ isPremium, accountId }}
              />
            </div>
          </div>
          <p className="username">{accountId}</p>
          <p className="time">
            {blockHeight === "now" ? (
              "now"
            ) : (
              <a className="text-white" href={link}>
                <Widget
                  loading=""
                  src="mob.near/widget/TimeAgo"
                  props={{ blockHeight }}
                />
              </a>
            )}
          </p>
        </Wrapper>
        {pinned && (
          <span title="Pinned" className="ms-2">
            <i className="bi bi-pin-angle" />
          </span>
        )}
      </div>
    </Overlay>
  );
}

return { User };
