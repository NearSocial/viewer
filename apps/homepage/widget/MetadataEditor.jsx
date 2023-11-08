const initialMetadata = props.initialMetadata ?? {};
const onChange = props.onChange;
const options = props.options;

State.init({
  initialMetadata,
  metadata: initialMetadata,
  reportedMetadata: initialMetadata,
  linktree: initialMetadata.linktree ?? {},
  image: initialMetadata.image,
  backgroundImage: initialMetadata.backgroundImage,
  screenshots: initialMetadata.screenshots ?? {},
});

const metadata = {
  name: options.name ? state.metadata.name : undefined,
  description: options.name ? state.metadata.description : undefined,
  linktree:
    options.linktree && Object.keys(state.linktree).length > 0
      ? state.linktree
      : undefined,
  image:
    options.image && state.image && Object.keys(state.image).length > 0
      ? state.image
      : undefined,
  backgroundImage:
    options.backgroundImage &&
    state.backgroundImage &&
    Object.keys(state.backgroundImage).length > 0
      ? state.backgroundImage
      : undefined,
  tags: options.tags ? state.metadata.tags : undefined,
  screenshots: options.screenshots ? state.metadata.screenshots : undefined,
};

if (
  onChange &&
  JSON.stringify(state.reportedMetadata) !== JSON.stringify(metadata)
) {
  State.update({
    reportedMetadata: metadata,
  });
  onChange(metadata);
}

const Container = styled.div`
  color: #fff;
`;

const CustomTagEditor = styled.div`
  .form-control {
    background: #23242b;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const CustomImageUpload = styled.div`
  .nav-link {
    background: transparent;
    color: #fff;
    border: none;
  }

  .nav.nav-tabs {
    border: none;
  }

  .nav-link.active {
    color: #fff;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: none;
  }

  .p-2 {
    border: none;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    /* border-top: 0; */
    background: #23242b !important;
    color: #fff !important;
  }

  .form-control {
    background: #23242b;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

return (
  <Container>
    {options.name && (
      <div className="mb-3">
        <label className="mb-2">{options.name.label ?? "Name"}</label>
        <input
          type="text"
          value={state.metadata.name}
          style={{
            background: "#23242b",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.20)",
          }}
        />
      </div>
    )}
    {options.image && (
      <div className="mb-3" style={{ color: "#000" }}>
        <label className="mb-2 text-white">
          {options.image.label ?? "Image"}
        </label>
        <CustomImageUpload>
          <Widget
            src="mob.near/widget/ImageEditorTabs"
            props={{
              image: state.image,
              onChange: (image) => State.update({ image }),
            }}
          />
        </CustomImageUpload>
      </div>
    )}
    {options.backgroundImage && (
      <div className="mb-3">
        <label className="mb-2">
          {options.backgroundImage.label ?? "Background image"}
        </label>
        <Widget
          src="mob.near/widget/ImageEditorTabs"
          props={{
            image: state.backgroundImage,
            onChange: (backgroundImage) => State.update({ backgroundImage }),
          }}
        />
      </div>
    )}
    {options.description && (
      <div className="mb-3">
        <label className="mb-2">
          {options.description.label ?? "Description"}
        </label>
        <span className="text-secondary"> (supports markdown)</span>
        <textarea
          className="form-control"
          rows={5}
          value={state.metadata.description}
          onChange={(e) => {
            state.metadata.description = e.target.value;
            State.update();
          }}
          style={{
            background: "#23242b",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.20)",
          }}
        />
      </div>
    )}
    {options.tags && (
      <CustomTagEditor className="mb-3">
        <label className="mb-2">{options.tags.label ?? "Tags"}</label>
        <Widget
          src="mob.near/widget/TagsEditor"
          props={{
            initialTagsObject: metadata.tags,
            tagsPattern: options.tags.pattern,
            placeholder:
              options.tags.placeholder ??
              "rust, engineer, artist, humanguild, nft, learner, founder",
            setTagsObject: (tags) => {
              state.metadata.tags = tags;
              State.update();
            },
          }}
        />
      </CustomTagEditor>
    )}
    {options.linktree &&
      (options.linktree.links ?? []).map((link) => (
        <div className="mb-3">
          <label class="mb-2">{link.label}</label>
          <div className="input-group">
            <span
              className="input-group-text"
              style={{
                background: "#23242b",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.20)",
              }}
            >
              {link.prefix}
            </span>
            <input
              type="text"
              value={state.linktree[link.name]}
              style={{
                background: "#23242b",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.20)",
              }}
            />
          </div>
        </div>
      ))}
  </Container>
);
