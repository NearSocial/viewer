const { fetchThings } = VM.require(
  "buildhub.near/widget/lib.everything-sdk",
) || {
  fetchThings: () => {},
};

const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

const { ProjectCard } = VM.require(
  "buildhub.near/widget/components.project.Card",
) || {
  ProjectCard: () => <></>,
};

// const projects = fetchThings("buildbox", "project");

const projects = [
  {
    title: "Build DAO",
    accountId: "build.sputnik-dao.near",
    tags: ["Open Source", "Community"],
    collaborators: ["efiz.near"],
  },
  {
    title: "Build DAO 1",
    accountId: "build.sputnik-dao.near",
    tags: ["Open Source", "Community"],
    collaborators: ["efiz.near", "dawnkelly.near"],
  },
  {
    title: "Build DAO 2",
    accountId: "build.sputnik-dao.near",
    tags: ["Open Source", "Community"],
    collaborators: ["efiz.near", "dawnkelly.near", "james.near"],
  },
  {
    title: "Build DAO 3",
    accountId: "build.sputnik-dao.near",
    tags: ["Open Source", "Community"],
    collaborators: [
      "efiz.near",
      "dawnkelly.near",
      "james.near",
      "itexpert120-contra.near",
    ],
  },
];

if (!projects) {
  return "";
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media screen and (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const [filters, setFilters] = useState({
  title: "",
});
const [showModal, setShowModal] = useState(false);

const toggleModal = () => {
  setShowModal((prev) => !prev);
};

const filteredProjects = useMemo(() => {
  let filtered = projects;
  if (filters.title !== "") {
    filtered = filtered.filter((project) =>
      project.title.toLowerCase().includes(filters.title ?? "".toLowerCase()),
    );
  }

  if (filters.teamSize !== "") {
    filtered = filtered.filter((project) => {
      switch (filters.teamSize) {
        case "1-10":
          return project.collaborators.length <= 10;
        case "10-50":
          return (
            project.collaborators.length <= 50 &&
            project.collaborators.length >= 10
          );
        case "50-100":
          return (
            project.collaborators.length <= 100 &&
            project.collaborators.length >= 50
          );
        case "100+":
          return project.collaborators.length > 100;
        default:
          return true;
      }
    });
  }

  if (filters.tags.length > 0) {
    filtered = filtered.filter((project) =>
      filters.tags.every((tag) => project.tags.includes(tag)),
    );
  }
  return filtered;
}, [filters, projects]);

return (
  <Wrapper
    className="container-xl mx-auto"
    style={{ margin: "24px 0" }}
    data-bs-theme="dark"
  >
    <Widget
      src="buildhub.near/widget/components.modals.FilterProjects"
      loading=""
      props={{
        showModal: showModal,
        toggleModal: toggleModal,
        filters: filters,
        setFilters: setFilters,
      }}
    />
    <div className="my-3 d-flex align-items-center justify-content-between">
      <h2 style={{ color: "var(--text-color, #fff)", fontSize: "18px" }}>
        Projects
      </h2>
      <Button variant="primary">Create Project</Button>
    </div>
    <div className="form-group d-flex gap-4 align-items-center justify-content-between">
      <div className="input-group">
        <div className="input-group-text">
          <i className="bi bi-search"></i>
        </div>
        <input
          className="form-control"
          style={{ borderLeft: "none" }}
          placeholder="Search by project ID or name"
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        />
      </div>
      <Button
        className="d-flex align-items-center"
        style={{ gap: 10, padding: "10px 26px" }}
        onClick={() => setShowModal(true)}
      >
        Filter <i className="bi bi-sliders"></i>
      </Button>
    </div>
    <Container>
      {filteredProjects.length === 0 && (
        <p className="fw-bold text-white">No Projects Found</p>
      )}
      {filteredProjects.map((project) => (
        <ProjectCard
          title={project.title}
          accountId={project.accountId}
          tags={project.tags}
          people={project.collaborators}
        />
      ))}
    </Container>
  </Wrapper>
);
