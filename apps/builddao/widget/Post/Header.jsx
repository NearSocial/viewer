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

const DotsSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="-2 -2 20 20"
    style={{ width: "1.25em" }}
  >
    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
  </svg>
);

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

return (
  <div className="d-flex flex-row align-items-center post-header">
    <div className="flex-grow-1" style={{ minWidth: 0, overflow: "hidden" }}>
      <div className="d-flex">
        <div className="left">
          <Widget
            loading=""
            src="mob.near/widget/MainPage.N.Post.Left"
            props={{ accountId, groupId }}
          />
        </div>
        <div className="d-flex flex-column">
          <div className="d-flex flex flex-shrink-1 overflow-hidden">
            {name && (
              <Overlay>
                <div className="text-truncate fw-bold">{name}</div>
              </Overlay>
            )}
            <div className="flex-shrink-0">
              <Widget
                loading={""}
                src="mob.near/widget/Checkmark"
                props={{ isPremium, accountId }}
              />
            </div>
          </div>
          <div
            className="d-flex flex-column flex-shrink-1 overflow-hidden mw-100"
            style={{ marginLeft: "2px" }}
          >
            <div className="flex-shrink-1 overflow-hidden">
              <Overlay>
                <div className="text-truncate text-muted">@{accountId}</div>
              </Overlay>
            </div>
            {!pinned && (
              <div className="text-nowrap text-muted flex-shrink-0">
                {blockHeight === "now" ? (
                  "now"
                ) : (
                  <a className="text-muted" href={link}>
                    <Widget
                      loading=""
                      src="mob.near/widget/TimeAgo"
                      props={{ blockHeight }}
                    />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    {pinned && (
      <span title="Pinned" className="ms-2">
        <i className="bi bi-pin-angle" />
      </span>
    )}
    {!pinned && !hideMenu && blockHeight !== "now" && (
      <span>
        <Button data-bs-toggle="dropdown" aria-expanded="false">
          <span className="icon">{DotsSvg}</span>
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
          {props.flagItem && (
            <li>
              <Widget
                src="mob.near/widget/MainPage.Common.FlagContent"
                props={{
                  item: props.flagItem,
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
