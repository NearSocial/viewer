const { Avatar, Modal } = VM.require("buildhub.near/widget/components") || {
  Modal: () => <></>,
  Avatar: () => <></>,
};

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
const name = props.name || Social.get(`${accountId}/profile/name`);

const postType = props.postType ?? "post";
const link = props.link;
const isPremium = !!props.isPremium;
const item = props.item;
const customActions = props.customActions ?? [];
const showTime = props.showTime ?? true;
const modalToggles = props.modalToggles;
const setItem = props.setItem;
const content = props.content; 

const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => {},
};

const Overlay = (props) => (
  <Link
    className="link-dark text-truncate d-inline-flex mw-100"
    key={accountId}
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

const [dropdown, setDropdown] = useState(false);
const toggleDropdown = () => {
  setDropdown(!dropdown);
};

const Dropdown = styled.div`
  border-radius: 8px;
  border: 1px solid var(--stroke-color, rgba(255, 255, 255, 0.2));
  background: var(--bg-2, #23242b);
  z-index: 20;

  display: flex;
  padding: 10px 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  .dropdown-item {
    color: #fff;

    /* Body/10px */
    font-family: InterVariable, sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    display: flex;
    padding: 10px;
    align-items: center;
    gap: 4px;
    align-self: stretch;
  }

  .dropdown-item:hover {
    transition: all 300ms;
    color: #000 !important;
    background: #fff;
  }
`;

const MemoizedOverlay = useMemo(
  () => (
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
          {showTime && (
            <p className="time">
              {blockHeight === "now" ? (
                "now"
              ) : (
                <Link className="text-white" href={link}>
                  <Widget
                    loading=""
                    src="mob.near/widget/TimeAgo"
                    props={{ blockHeight }}
                  />
                </Link>
              )}
              {props.isEdited && "(edited post)"}
            </p>
          )}
        </Wrapper>
        {pinned && (
          <span title="Pinned" className="ms-2 text-white">
            <i className="bi bi-pin-angle" />
          </span>
        )}
      </div>
    </Overlay>
  ),
  [props.variant, accountId, name, isPremium, blockHeight, link, pinned]
);

const [showModal, setShowModal] = useState(false);
const toggleModal = () => {
  setShowModal(!showModal);
};
const [modalType, setModalType] = useState("");
const closeModal = () => {
  setShowModal(false);
  setModalType("");
};

const plugins = {
  edit: {
    path: "buildhub.near/widget/components.modals.EditPost",
    init: {
      item: item,
      content: content,
      closeModal: closeModal,
    },
    icon: "bi-pencil",
    label: "Edit Post",
    required: context.accountId === accountId,
    onClick: () => {
      setModalType("edit");
      setShowModal(true);
    },
  },
  delete: {
    path: "buildhub.near/widget/components.modals.DeletePost",
    init: {
      item: item,
      closeModal: closeModal,
    },
    icon: "bi-trash",
    label: "Delete Post",
    required: context.accountId === accountId,
    onClick: () => {
      setModalType("delete");
      setShowModal(true);
    },
  },
};

return (
  <div className="d-flex align-items-center">
    <Modal
      open={showModal}
      title={plugins[modalType]?.label}
      onOpenChange={toggleModal}
    >
      <Widget
        src={plugins[modalType]?.path}
        loading=""
        props={plugins[modalType]?.init}
      />
    </Modal>
    {MemoizedOverlay}
    {!pinned && !hideMenu && blockHeight !== "now" && (
      <span className="ms-auto flex-shrink-0 position-relative">
        <Button
          style={{ color: "var(--text-color, #fff)" }}
          onClick={() => toggleDropdown()}
        >
          <i className="bi bi-three-dots-vertical"></i>
        </Button>
        {dropdown && (
          <Dropdown
            className="position-absolute shadow-sm"
            style={{ top: 16, right: 16 }}
          >
            {Object.keys(plugins).map((key) => {
              const plugin = plugins[key];
              if (plugin.required) {
                return (
                  <button
                    key={key}
                    onClick={plugin.onClick}
                    className="dropdown-item"
                  >
                    <i className={`bi ${plugin.icon}`}></i> {plugin.label}
                  </button>
                );
              }
            })}
            {customActions.length > 0 &&
              customActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    if (action.type === "modal") {
                      action.onClick(modalToggles);
                      setItem(item);
                    }
                  }}
                  className="dropdown-item"
                >
                  <i className={`bi ${action.icon}`}></i>{" "}
                  <span>{action.label}</span>
                </button>
              ))}
            {/* Seperator */}
            {(context.accountId === accountId || customActions.length > 0) && (
              <div
                style={{
                  border:
                    "1px solid var(--stroke-color, rgba(255, 255, 255, 0.2)",
                  width: "100%",
                }}
              ></div>
            )}
            <Link
              className="link-light text-decoration-none dropdown-item"
              href={`${link}&raw=true`}
            >
              <i className="bi bi-filetype-raw" /> Markdown Source
            </Link>

            <Widget
              src="mob.near/widget/MainPage.Common.HideAccount"
              loading=""
              props={{ accountId }}
            />
            {item && (
              <Widget
                src="mob.near/widget/MainPage.Common.FlagContent"
                loading=""
                props={{
                  item: item,
                  label: `Flag ${postType}`,
                }}
              />
            )}
          </Dropdown>
        )}
      </span>
    )}
  </div>
);
