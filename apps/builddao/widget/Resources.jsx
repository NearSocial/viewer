const { MarkdownView } = VM.require("buildhub.near/widget/md-view");
const { Button } = VM.require("buildhub.near/widget/components.Button");

Button || (Button = () => <></>);
MarkdownView || (MarkdownView = () => <></>);

const fetchResources = () => {
  const res = fetch(
    "https://raw.githubusercontent.com/itexpert120/buildhub-resources/main/resources.json"
  );
  return JSON.parse(res.body);
};

const resources = fetchResources();

if (!resources) {
  return <div>Loading...</div>;
}

const [currentResource, setCurrentResource] = useState(resources[0]);

return (
  <Widget
    src="/*__@appAccount__*//widget/components.AsideWithMainContent"
    props={{
      sideContent: Object.keys(resources || {}).map((resource) => {
        const data = resources[resource];
        return (
          <Button
            id={resource}
            variant={currentResource.name === data.name ? "primary" : "outline"}
            onClick={() => setCurrentResource(data)}
            className={
              "align-self-stretch flex-shrink-0 justify-content-start fw-medium"
            }
            style={{ fontSize: "14px" }}
          >
            <i className={`bi ${data.biIcon} `}></i>
            {data.name}
          </Button>
        );
      }),
      mainContent: <MarkdownView path={currentResource.mdLink} />
    }}
  />
);
