const { User, Hashtag } = VM.require("buildhub.near/widget/components") || {
  User: () => <></>,
  Hashtag: () => <></>,
};

const { getProjectMeta } = VM.require(
  "buildhub.near/widget/lib.project-data"
) || {
  getProjectMeta: () => {},
};

const { id } = props;

const project = getProjectMeta(id);

const { description, tags, contributors, accountId, profile } = project;

console.log("contributors", contributors);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .heading {
    color: var(--white-100, #fff);
    line-height: 170%; /* 27.2px */
    margin: 0;
  }

  .description {
    color: var(--white-50, #b0b0b0);
    line-height: 170%; /* 27.2px */
    margin: 0;
  }
`;

const MapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g clip-path="url(#clip0_777_6945)">
      <path
        d="M7.33335 11.9587C4.70248 11.6306 2.66669 9.38638 2.66669 6.66665C2.66669 3.72113 5.0545 1.33331 8.00002 1.33331C10.9456 1.33331 13.3334 3.72113 13.3334 6.66665C13.3334 9.38638 11.2976 11.6306 8.66669 11.9587V14H7.33335V11.9587ZM8.00002 10.6666C10.2092 10.6666 12 8.87578 12 6.66665C12 4.45751 10.2092 2.66665 8.00002 2.66665C5.79088 2.66665 4.00002 4.45751 4.00002 6.66665C4.00002 8.87578 5.79088 10.6666 8.00002 10.6666ZM3.33335 14.6666H12.6667V16H3.33335V14.6666Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_777_6945">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// const tags = Object.keys(profile.tags ?? []);

return (
  <Container>
    <div className="section">
      <p className="heading">About</p>
      <p className="description">
        {description ? (
          <Markdown text={description} />
        ) : (
          "No information available"
        )}
      </p>
    </div>
    <div className="d-flex gap-5">
      <div className="section">
        <p className="heading">Location</p>
        <p className="description d-flex align-items-center gap-2">
          <MapIcon /> {profile.location ?? "No Location"}
        </p>
      </div>
      <div className="section">
        <p className="heading">Team Size</p>
        <p className="description d-flex align-items-center gap-2">
          <i className="bi bi-person"></i>
          {!contributors || !contributors.length
            ? "0"
            : contributors.length <= 10
            ? "1-10"
            : contributors.length <= 50
            ? "10-50"
            : contributors.length <= 100
            ? "50-100"
            : "100+"}
        </p>
      </div>
    </div>
    <div className="section">
      <p className="heading">Contributors</p>
      {!contributors && <p className="description">No Contributors</p>}
      <div className="d-flex gap-4">
        {contributors &&
          contributors.map((teammate) => (
            <User accountId={teammate} variant={"mobile"} />
          ))}
      </div>
    </div>
    <div className="section">
      <p className="heading">Project Tags</p>
      <div className="d-flex flex-align-center flex-wrap" style={{ gap: 12 }}>
        {tags && tags.map((it) => <Hashtag key={it}>{it}</Hashtag>)}
        {tags.length === 0 && <p className="description">No tags</p>}
      </div>
    </div>
  </Container>
);
