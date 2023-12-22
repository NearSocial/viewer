const Container = styled.div`
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  max-width: 1200px;

  a {
    text-decoration: none;
    color: inherit;
  }
`;

const [content, setContent] = useState("embeds.near/widget/Plugin.Marketplace");

const Content = () => {
  return <Widget src={content} props={props} />;
};

return (
  <Container>
    <div className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/embeds.near/widget/Plugin.Index">
          <i className="bi bi-plug" /> Every Plugin
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <div
                className="nav-link active"
                aria-current="page"
                onClick={() =>
                  setContent("embeds.near/widget/Plugin.Marketplace")
                }
              >
                Marketplace
              </div>
            </li>
            <li className="nav-item">
              <div
                className="nav-link active"
                onClick={() => setContent("embeds.near/widget/Plugin.Settings")}
              >
                Installed
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="container">
      <Content />
    </div>
  </Container>
);
