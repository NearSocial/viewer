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
  { id: "overview", title: "Overview" },
  { id: "discussion", title: "Discussion" },
  { id: "task", title: "Task" },
  { id: "code", title: "Code" },
  { id: "roadmap", title: "Roadmap" },
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
    <div className="tab-content" style={{ marginTop: 8 }} id="pills-tabContent">
      <div
        className="tab-pane fade show active"
        id="pills-overview"
        role="tabpanel"
        aria-labelledby="pills-overview-tab"
      >
        <Widget
          src="buildhub.near/widget/components.project.page.Overview"
          loading=""
          props={{
            accountId,
            profile,
          }}
        />
      </div>
      <div
        className="tab-pane fade"
        id="pills-discussion"
        role="tabpanel"
        aria-labelledby="pills-discussion-tab"
      >
        <Widget
          src="buildhub.near/widget/components.project.page.Discussion"
          loading=""
          props={{
            accountId,
            profile,
          }}
        />
      </div>
      <div
        className="tab-pane fade widget"
        id="pills-task"
        role="tabpanel"
        aria-labelledby="pills-task-tab"
      >
        <Widget
          src="buildhub.near/widget/components.project.page.Task"
          loading=""
          props={{
            accountId,
            profile,
          }}
        />
      </div>
      <div
        className="tab-pane fade widget"
        id="pills-code"
        role="tabpanel"
        aria-labelledby="pills-code-tab"
      >
        <Widget
          src="buildhub.near/widget/components.project.page.Code"
          loading=""
          props={{
            accountId,
            profile,
          }}
        />
      </div>
      <div
        className="tab-pane fade widget"
        id="pills-roadmap"
        role="tabpanel"
        aria-labelledby="pills-roadmap-tab"
      >
        <Widget
          src="buildhub.near/widget/components.project.page.Roadmap"
          loading=""
          props={{
            accountId,
            profile,
          }}
        />
      </div>
    </div>
  </>
);
