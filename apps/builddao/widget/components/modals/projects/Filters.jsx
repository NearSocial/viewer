const { Button } = VM.require("${config_account}/widget/components") || {
  Button: () => <></>,
};

const [teamSize, setTeamSize] = useState(props.filters.teamSize ?? "");
const [tags, setTags] = useState(props.filters.tags ?? []);

const handleTags = (tags) => {
  let filtered = tags.map((tag) => (tag.customOption ? tag.label : tag));
  setTags(filtered);
};

return (
  <div className="d-flex flex-column gap-3">
    <div className="d-flex flex-column gap-3" key={"team-sizes"}>
      <label>Team Size</label>
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <select
          value={teamSize}
          onChange={(e) => setTeamSize(e.target.value)}
          className="form-select"
        >
          <option selected disabled value="">
            Select Team Size
          </option>
          <option value="1-10">1-10</option>
          <option value="10-50">10-50</option>
          <option value="50-100">50-100</option>
          <option value="100+">100+</option>
        </select>
      </div>
    </div>
    <div className="form-group">
      <label className="mb-3">Tags</label>
      <Typeahead
        multiple
        options={
          props.tagFilters ?? ["Community", "Open Source", "Weekly", "DAO"]
        }
        allowNew
        placeholder="Start Typing"
        selected={tags}
        onChange={(e) => handleTags(e)}
      />
    </div>
    <div className="d-flex align-items-center justify-content-end gap-2">
      <Button
        variant="outline"
        onClick={() => {
          setTeamSize("");
          setTags([]);
        }}
      >
        Clear Filters
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          props.setFilters({
            ...filters,
            tags: tags,
            teamSize: teamSize,
          });
          props.toggleModal();
        }}
      >
        Filter
      </Button>
    </div>
  </div>
);
