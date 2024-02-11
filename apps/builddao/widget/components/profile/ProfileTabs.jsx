const { Post } = VM.require("buildhub.near/widget/components") || {
  Post: () => <></>,
};

const accountId = props.accountId ?? context.accountId;
if (!accountId) {
  return "No account ID";
}

const profile = props.profile ?? Social.getr(`${accountId}/profile`);

if (profile === null) {
  return "Loading";
}

const description = profile.description;

const pills = [
  { id: "posts", title: "Posts" },
  { id: "nfts", title: "NFTs" },
  { id: "widget", title: "Widgets" },
];

const Nav = styled.div`
  .nav-pills {
    background: var(--bg-1, #0b0c14);
    font-weight: 500;
    --bs-nav-pills-border-radius: 0;
    --bs-nav-link-color: var(--font-color, #fff);
    --bs-nav-pills-link-active-color: var(--font-color, #fff);
    --bs-nav-pills-link-active-bg: var(--bg-1, #0b0c14);
    --bs-nav-link-padding-y: 0.75rem;
    border-bottom: 1px solid var(--stroke-color, rgba(255, 255, 255, 0.2));
    padding-top: 3px;
  }
  .nav-link.active {
    border-bottom: 2px solid var(--Yellow, #ffaf51);
  }

  .nav-item:not(:has(> .disabled)):hover {
    background: rgba(13, 110, 253, 0.15);
  }
`;

const StyledContent = styled.div`
  #pills-nfts {
    .nft-card {
      background: var(--bg-1, #0b0c14);
      border-radius: 1rem;
      border: 1px solid var(--stroke-color, rgba(255, 255, 255, 0.2));

      .nft-title,
      nft-description {
        color: var(--font-color, #fff);
      }
    }
  }

  #pills-widget {
  }
`;

return (
  <>
    <Nav>
      <ul className="nav nav-pills nav-fill" id="pills-tab" role="tablist">
        {pills.map(({ id, title }, i) => (
          <li className="nav-item" role="presentation" key={i}>
            <button
              className={`nav-link ${i === 0 ? "active" : ""}`}
              id={`pills-${id}-tab`}
              data-bs-toggle="pill"
              data-bs-target={`#pills-${id}`}
              type="button"
              role="tab"
              aria-controls={`pills-${id}`}
              aria-selected={i === 0}
              onClick={() => {
                const key = `load${id}`;
                !state[key] && State.update({ [key]: true });
              }}
            >
              {title}
            </button>
          </li>
        ))}
      </ul>
    </Nav>
    <StyledContent
      className="tab-content"
      style={{ marginTop: 40 }}
      id="pills-tabContent"
    >
      <div
        className="tab-pane fade show active"
        id="pills-posts"
        role="tabpanel"
        aria-labelledby="pills-posts-tab"
      >
        <div className="mx-auto">
          <Widget
            key="feed"
            loading=""
            src="buildhub.near/widget/components.profile.AccountFeed"
            props={{ accounts: [accountId] }}
          />
        </div>
      </div>
      <div
        className="tab-pane fade"
        id="pills-nfts"
        role="tabpanel"
        aria-labelledby="pills-nfts-tab"
      >
        {state.loadnfts && (
          <Widget
            src="mob.near/widget/N.YourNFTs"
            loading=""
            props={{ accountId }}
          />
        )}
      </div>
      <div
        className="tab-pane fade widget"
        id="pills-widget"
        role="tabpanel"
        aria-labelledby="pills-widget-tab"
      >
        {state.loadwidget && (
          <Widget
            src="buildhub.near/widget/components.profile.LastWidgets"
            loading=""
            props={{ accountId }}
          />
        )}
      </div>
    </StyledContent>
  </>
);
