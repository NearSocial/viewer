const { MarkdownView } =
  VM.require("buildhub.near/widget/md-view") || (() => <></>);

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1rem;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const Aside = styled.div`
  grid-column: span 1 / span 1;
`;

const MainContent = styled.div`
  grid-column: span 4 / span 4;
`;

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

console.log(resources);

const [currentResource, setCurrentResource] = useState(resources[0].name);

function getMdLinkByName(nameToFind) {
  for (const item of resources) {
    if (item.name === nameToFind) {
      return item.mdLink;
    }
  }

  return null;
}

return (
  <Container>
    <Aside>
      <Widget
        src="/*__@appAccount__*//widget/resources-aside"
        props={{
          currentResource: currentResource,
          setCurrentResource: setCurrentResource,
          resources: resources,
        }}
      />
    </Aside>
    <MainContent>
      <MarkdownView path={getMdLinkByName(currentResource)} />
    </MainContent>
  </Container>
);
