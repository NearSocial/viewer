const { type, widgetSrc } = props;

const plugins = Social.keys(`*/plugin/${type || "*"}/*`, "final", {
  return_type: "BlockHeight",
});

if (!plugins) {
  return "Loading...";
}

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

const Grid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));

  @media (min-width: 576px) {
    grid-gap: 15px;
  }

  @media (min-width: 992px) {
    grid-gap: 20px;
  }

  > * {
    transition: transform 0.3s ease; // Smooth transition for hover effect

    &:hover {
      transform: scale(1.03); // Subtle scale effect on hover
    }
  }
`;

const processData = useCallback(
  (data) => {
    const accounts = Object.entries(data);
    const allItems = accounts
      .map((account) => {
        const accountId = account[0];
        const plugins = Object.entries(account[1].plugin.embed);
        if (plugins.length > 0) {
          return plugins.map((kv) => {
            return {
              accountId,
              name: kv[0],
              metadata: Social.get(
                `${accountId}/plugin/embed/${kv[0]}/metadata/**`,
                "final"
              ),
            };
          });
        } else {
          return {
            accountId,
            name: account[1].plugin.embed,
            metadata: Social.get(
              `${accountId}/plugin/embed/${account[1].plugin.embed}/metadata/**`,
              "final"
            ),
          };
        }
      })
      .flat();

    // sort by latest
    allItems.sort((a, b) => b.blockHeight - a.blockHeight);
    return allItems;
  },
  [type]
);

const items = processData(plugins);

if (!items) {
  return "Loading data...";
}

function Item({ accountId, name, metadata }) {
  return (
    <Widget
      src="embeds.near/widget/EmbedPlugin"
      props={{ accountId, name, type, metadata }}
    />
  );
}

const [showCreator, setShowCreator] = useState("");

return (
  <Container>
    <p class="d-flex flex-row-reverse">
      <button
        class="btn btn-primary"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#plugin-creator"
        aria-expanded="false"
        aria-controls="plugin-creator"
      >
        <i className="bi bi-plus" /> Create Plugin
      </button>
    </p>
    <div class="collapse" id="plugin-creator">
      <div class="card card-body">
        <Widget src="embeds.near/widget/Plugin.Creator" />
      </div>
    </div>
    {items.length === 0 ? (
      <p>No items of type: "{type}" found.</p>
    ) : (
      <Widget
        src="everycanvas.near/widget/ItemFeed"
        props={{
          items: items,
          renderItem: Item,
          perPage: 100,
          renderLayout: (items) => <Grid>{items}</Grid>,
        }}
      />
    )}
  </Container>
);
