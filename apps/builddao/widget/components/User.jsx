const { Avatar } = VM.require("buildhub.near/widget/components");

const Button = styled.div`
  line-height: 20px;
  min-height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: left;
  background: inherit;
  color: #6c757d;
  font-size: 16px;
  .icon {
    position: relative;
    &:before {
      margin: -8px;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-radius: 50%;
    }
  }

  &:not([disabled]) {
    cursor: pointer;
  }

  &:not([disabled]):hover {
    opacity: 1 !important;
    color: DeepSkyBlue;

    .icon:before {
      background: rgba(0, 191, 255, 0.1);
    }
  }
`;

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

const accountId = props.accountId;
const blockHeight = props.blockHeight;
const pinned = !!props.pinned;
const hideMenu = !!props.hideMenu;
const name = Social.get(`${accountId}/profile/name`);

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
  <div className="d-flex align-items-center">
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
    {!pinned && !hideMenu && blockHeight !== "now" && (
      <span className="ms-auto flex-shrink-0">
        <Button data-bs-toggle="dropdown" aria-expanded="false">
          <i className="bi bi-three-dots-vertical"></i>
        </Button>
        <ul className="dropdown-menu">
          <li className="dropdown-item">
            <a
              className="link-dark text-decoration-none"
              href={`${link}&raw=true`}
            >
              <i className="bi bi-filetype-raw" /> View raw markdown source
            </a>
          </li>
          <li>
            <Widget
              src="mob.near/widget/MainPage.Common.HideAccount"
              props={{ accountId }}
            />
          </li>
          {flagItem && (
            <li>
              <Widget
                src="mob.near/widget/MainPage.Common.FlagContent"
                props={{
                  item: flagItem,
                  label: `Flag ${postType} for moderation`,
                }}
              />
            </li>
          )}
        </ul>
      </span>
    )}
  </div>
);
