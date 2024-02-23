const { Feed } = VM.require("devs.near/widget/Feed") || {
  Feed: () => <></>,
};

const SimpleItem = ({ accountId, path, blockHeight, type }) => (
  <div>{JSON.stringify({ accountId, path, blockHeight, type })}</div>
);

const SimpleLayout = ({ children }) => (
  <div className="simple-layout">{children}</div>
);

const [showCompose, setShowCompose] = useState(false);
const [typeWhitelist, setTypeWhitelist] = useState([]);

// Placeholder for index data
const [index, setIndex] = useState([
  {
    accountId: "123",
    blockHeight: 1,
    action: "action",
    key: "key",
    value: { path: "path/to/resource", type: "md" },
  },
]);

// Handlers to update state
const handleShowComposeChange = (e) => setShowCompose(e.target.checked);
const handleTypeWhitelistChange = (e) =>
  setTypeWhitelist(e.target.value.split(","));

return (
  <div>
    <h2>Feed Configuration</h2>
    <label>
      Show Compose:
      <input
        type="checkbox"
        checked={showCompose}
        onChange={handleShowComposeChange}
      />
    </label>
    <br />
    <label>
      Type Whitelist (comma-separated):
      <input
        type="text"
        value={typeWhitelist.join(",")}
        onChange={handleTypeWhitelistChange}
      />
    </label>
    <hr />
    {/* <Feed
      index={index}
      showCompose={showCompose}
      typeWhitelist={typeWhitelist.length > 0 ? typeWhitelist : undefined}
      Item={SimpleItem}
      Layout={SimpleLayout}
    /> */}
  </div>
);
