const { Avatar } = VM.require("buildhub.near/widget/components") || {
  Avatar: () => <></>,
};

const Wrapper = styled.div`
  color: #fff;

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
    margin: 0;
  }

  p.time {
    color: var(--White-100, #fff);
    font-size: ${(props) => (props.variant === "mobile" ? "10px" : "13px")};
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    ${(props) =>
      !props.variant &&
      `
      p {
        font-size: 13px !important;
      }

      p.username {
        font-size: 10px !important;
      }

      p.time {
        font-size: 10px !important;
      }
    `}
  }
`;

const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => {},
};

const accountId = props.accountId;
const name = props.name || Social.get(`${accountId}/profile/name`);
const isPremium = !!props.isPremium;

const Overlay = (props) => (
  <Link
    className="link-dark text-truncate d-inline-flex mw-100"
    to={href({
      widgetSrc: "buildhub.near/widget/app",
      params: {
        page: "profile",
        accountId,
      },
    })}
  >
    <Widget
      src="mob.near/widget/Profile.N.OverlayTrigger"
      loading={""}
      props={{
        accountId,
        children: props.children,
      }}
    />
  </Link>
);

return (
  <Overlay>
    <div className="d-flex gap-1">
      <Avatar variant={props.variant} accountId={accountId} />
      <Wrapper variant={props.variant} className="d-flex gap-1 flex-column">
        <div className="d-flex align-items-center g-1">
          <p className="m-0">{name || "No-Name Profile"}</p>
          <div className="flex-shrink-0">
            <Widget
              loading={""}
              src="mob.near/widget/Checkmark"
              props={{ isPremium, accountId }}
            />
          </div>
          <Widget
            loading=""
            src="buildhub.near/widget/components.VerifiedHuman"
            props={{
              accountId: accountId,
            }}
          />
        </div>
        <p className="username">{accountId}</p>
      </Wrapper>
    </div>
  </Overlay>
);
