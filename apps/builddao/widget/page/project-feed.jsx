const { fetchProjects } = VM.require(
  "buildbox.near/widget/utils.projects-sdk"
) || {
  fetchProjects: () => {},
};

const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

const { ProjectCard } = VM.require(
  "buildhub.near/widget/components.project.Card"
) || {
  ProjectCard: () => <></>,
};

const app = props.app || "buildbox";
const type = props.type || "project";

const data = fetchProjects(app, type);

if (!data) {
  return "Loading...";
}

/* HELPER FUNCTION */
function isNearAddress(address) {
  if (typeof address !== "string") {
    return false;
  }

  // Allow both ".near" and ".testnet" endings
  if (!address.endsWith(".near") && !address.endsWith(".testnet")) {
    return false;
  }

  const parts = address.split(".");
  if (parts.length !== 2) {
    return false;
  }

  if (parts[0].length < 2 || parts[0].length > 32) {
    return false;
  }

  if (!/^[a-z0-9_-]+$/i.test(parts[0])) {
    return false;
  }

  return true;
}

const processData = useCallback(
  (data) => {
    const accounts = Object.entries(data);

    const allItems = accounts
      .map((account) => {
        const accountId = account[0];

        return Object.entries(account[1][app][type]).map((kv) => {
          const metadata = JSON.parse(kv[1]);
          const members = metadata.teammates;

          // if (members) {
          // removing extra characters and splitting the string into an array
          const arr = members.replace(/[\[\]\(\)@]/g, "").split(/[\s,]+/);

          // filtering out teammates that are not near addresses
          const hexRegex = /^[0-9A-F\-_]+$/i;
          const valid = arr.filter((teammate) => {
            if (hexRegex.test(teammate)) {
              return teammate;
            }
            return isNearAddress(teammate);
          });

          valid.unshift(accountId);

          // making sure the array is unique
          const unique = [...new Set(valid)];
          // }
          const collaborators = unique || [];

          // console.log("metadata: ", metadata);
          return {
            accountId,
            type: type,
            title: kv[0],
            metadata,
            tags: metadata.tracks || [],
            collaborators,
          };
        });
      })
      .flat();

    // sort by latest
    allItems.sort((a, b) => b.blockHeight - a.blockHeight);
    return allItems;
  },
  [type]
);

const projects = processData(data);

console.log("projects from buildbox", projects);

// const projects = [
//   {
//     title: "Build DAO",
//     accountId: "build.sputnik-dao.near",
//     tags: ["Open Source", "Community"],
//     collaborators: ["efiz.near"],
//   },
// ];

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
      project.title.toLowerCase().includes(filters.title ?? "".toLowerCase())
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
      filters.tags.every((tag) => project.tags.includes(tag))
    );
  }
  return filtered;
}, [filters, projects]);

// console.log("filteredProjects", filteredProjects.tags);

const tagFilters = useMemo(() => {
  let tags = projects.map((project) => project.tags).flat();
  tags = [...new Set(tags)];
  return tags;
}, [projects]);

console.log("tagFilters", tagFilters);

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
        tagFilters,
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
