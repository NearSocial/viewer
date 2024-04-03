if (context.accountId !== "buildhub.near") {
  return <div className="text-white">Not authorized</div>;
}

const { Header } = VM.require("${config_account}/widget/components.Header") || {
  Header: () => <></>,
};

const { Button } = VM.require("${config_account}/widget/components") || {
  Button: () => <></>,
};

const { routes } = VM.require("${config_account}/widget/config.feed") ?? {
  routes: {},
};

const [feed, setFeed] = useState("");
const routeKeys = Object.keys(routes).filter(
  (key) => routes[key].hide !== true,
);

const [feedPath, setFeedPath] = useState("");
const [feedBlockheight, setFeedBlockheight] = useState("");
const [feedName, setFeedName] = useState("");
const [feedIcon, setFeedIcon] = useState("");
const [feedTags, setFeedTags] = useState([]);
const [feedTemplate, setFeedTemplate] = useState("");

useEffect(() => {
  setFeedPath(routes[feed].path || "");
  setFeedBlockheight(routes[feed].blockHeight || "");
  setFeedName(routes[feed].init.name || "");
  setFeedIcon(routes[feed].init.icon || "");
  setFeedTags(routes[feed].init.requiredHashtags || []);
  setFeedTemplate(routes[feed].init.template || "");
}, [feed]);

const onSave = () => {
  Social.set({
    ...routes,
    [feed]: {
      path: feedPath,
      blockHeight: feedBlockheight,
      init: {
        name: feedName,
        icon: feedIcon,
        requiredHashtags:
          feedTags.map((it) => {
            if (it.customOption) {
              return it.label;
            }
            return it;
          }) ?? [],
        template: feedTemplate,
      },
    },
  });
};

return (
  <div data-bs-theme="dark" className="text-white mb-3">
    <Header>Feed Editor</Header>
    <div className="row mb-3">
      <div className="form-group mb-3 mb-md-0 col-md-3">
        <label>Feed Key</label>
        <input
          className="form-control"
          value={feed}
          onChange={(e) => setFeed(e.target.value)}
        />
      </div>
      <div className="form-group mb-3 mb-md-0 col-md-6">
        <label>Feed Path</label>
        <input
          className="form-control"
          value={feedPath}
          onChange={(e) => setFeedPath(e.target.value)}
        />
      </div>
      <div className="form-group mb-3 mb-md-0 col-md-3">
        <label>Feed Blockheight</label>
        <input
          className="form-control"
          value={feedBlockheight}
          onChange={(e) => setFeedBlockheight(e.target.value)}
        />
      </div>
    </div>
    <div className="row mb-3">
      <div className="form-group mb-3 mb-md-0 col-md-4">
        <label>Feed Name</label>
        <input
          className="form-control"
          value={feedName}
          onChange={(e) => setFeedName(e.target.value)}
        />
      </div>
      <div className="form-group mb-3 mb-md-0 col-md-4">
        <label>Feed Icon</label>
        <input
          className="form-control"
          value={feedIcon}
          onChange={(e) => setFeedIcon(e.target.value)}
        />
      </div>
      <div className="form-group mb-3 mb-md-0 col-md-4">
        <label>Required Hashtags</label>
        <Typeahead
          multiple
          options={[]}
          allowNew
          selected={feedTags}
          onChange={(e) => setFeedTags(e)}
        />
      </div>
    </div>
    <div className="row mb-3">
      <div className="form-group mb-3 mb-md-0 col-md-12">
        <label>Feed Template</label>
        <textarea
          style={{ height: 200 }}
          className="form-control"
          value={feedTemplate}
          onChange={(e) => setFeedTemplate(e.target.value)}
        />
      </div>
    </div>
    <div className="mb-3">
      <Button
        disabled={
          !feed || !feedName || !feedPath || !feedBlockheight || !feedIcon
        }
        variant="primary"
        onClick={onSave}
      >
        Save Route
      </Button>
    </div>
    <div className="d-flex flex-column gap-3">
      {routeKeys.map((routeKey) => {
        const route = routes[routeKey];
        return (
          <div
            key={routeKey}
            className="d-flex justify-content-between align-items-center"
          >
            <div className="d-flex align-items-center gap-2">
              <span>
                <i className={`bi ${route.init.icon}`}></i>
              </span>
              <span>{route.init.name}</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                type="icon"
                className="bg-primary rounded-3"
                onClick={() => setFeed(routeKey)}
              >
                <i className="bi bi-pencil text-white"></i>
              </Button>
              <Button
                type="icon"
                className="bg-danger rounded-3"
                style={{
                  fontSize: 24,
                }}
                onClick={() => {
                  const newRoutes = { ...routes };
                  delete newRoutes[routeKey];
                  Social.set(newRoutes);
                }}
              >
                <i className="bi bi-x text-white"></i>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
