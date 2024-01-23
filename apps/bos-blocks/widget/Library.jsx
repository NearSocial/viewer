/**
 * This is just a direct copy of mob.near/widget/N.Library
 */
const accountId = context.accountId || "root.near";
const authorId = "mob.near";

const itemDescription =
  'The identifier item. It will be used as a unique identifier of the entity that receives the action. It\'s also used as a key of the action in the index.\nThe item should be an object with the following keys: `type`, `path` and optional `blockHeight`.\n- `type`: If the data is stored in the social DB, then the type is likely `"social"`, other types can be defined in the standards.\n- `path`: The path to the item. For a `"social"` type, it\'s absolute path within SocialDB, e.g. `alice.near/post/main`.\n- `blockHeight`: An optional paremeter to indicate the block when the data was stored. Since SocialDB data can be overwritten to save storage, the exact data should be referenced by the block height (e.g. for a given post). But if the latest data should be used, then `blockHeight` should be ommited.\n\nExamples of `item`:\n- `{type: "social", path: "mob.near/widget/N.Library"}`\n- `{type: "social", path: "mob.near/post/main", blockHeight: 81101335}`\n';

const components = [
  {
    title: "Feed",
    // category: "Profile",
    widgetName: "Feed",
    description:
      "",
    // demoProps: { accountId },
    // requiredProps: {
    //   accountId: "The account ID of the profile",
    // },
    // optionalProps: {
    //   profile: "Object that holds profile information to display",
    //   fast: "Render profile picture faster using external cache, default true if the `props.profile` is not provided",
    //   hideDescription: "Don't show description, default false",
    // },
  },
  {
    title: "Context Menu",
    // category: "Profile",
    widgetName: "ContextMenu",
    description:
      "",
    // demoProps: { accountId, tooltip: true },
    // requiredProps: {
    //   accountId: "The account ID of the profile",
    // },
    // optionalProps: {
    //   profile: "Object that holds profile information to display",
    //   fast: "Render profile picture faster using external cache, default true if the `props.profile` is not provided",
    //   tooltip:
    //     "Display overlay tooltip when you hover over the profile, default false",
    // },
  },
  {
    title: "Router",
    // category: "Profile",
    widgetName: "Router",
    description:
      "",
    // demoProps: { accountId, tooltip: true },
    // requiredProps: {
    //   accountId: "The account ID of the profile",
    // },
    // optionalProps: {
    //   link: "Whether to make profile clickable with a link to the profile page, default true.",
    //   hideAccountId: "Don't show account ID, default false",
    //   hideName: "Don't show profile name, default false",
    //   hideImage: "Don't show profile picture, default false",
    //   hideCheckmark: "Don't show premium checkmark, default false",
    //   profile: "Object that holds profile information to display",
    //   fast: "Render profile picture faster using external cache, default true if the `props.profile` is not provided",
    //   title:
    //     'Optional title when you hover over the profile. Default `"${name} ${accountId}"`',
    //   tooltip:
    //     "Display overlay tooltip or title when you hover over the profile, default false. Will display a custom title if tooltip is given. If tooltip is true, the full tooltip is displayed. Default false",
    // },
  },
];

const renderProps = (props, optional) => {
  return Object.entries(props || {}).map(([key, desc]) => {
    return (
      <tr key={key}>
        <td>
          <span className={`code prop-key${optional ? " optional" : ""}`}>
            {key}
          </span>
        </td>
        <td className="prop-desc">
          <Markdown text={desc} />
        </td>
      </tr>
    );
  });
};

const renderComponent = (c, i) => {
  const widgetSrc = `${authorId}/widget/${c.widgetName}`;
  const embedCode = `<Widget\n  src="${widgetSrc}"\n  props={{${JSON.stringify(
    c.demoProps,
    undefined,
    2
  )
    .slice(1, -1)
    .split("\n")
    .map((s) => `  ${s}`)
    .join("\n")}}}\n/>\n`;
  const id = c.title.toLowerCase().replaceAll(" ", "-");
  return (
    <div className="component" key={i}>
      <div className="anchor" id={id} />
      <a href={`#${id}`}>
        <h3>{c.title}</h3>
      </a>
      <p>{c.description}</p>
      <label>Preview</label>
      <div className="preview mb-3" style={c.previewStyle}>
        <Widget src={widgetSrc} props={c.demoProps} />
      </div>
      <label>Component</label>
      <div className="d-flex flex-row flex-wrap justify-content-between mb-3">
        <div className="path font-monospace">
          <Widget
            src="mob.near/widget/CopyButton"
            props={{
              text: widgetSrc,
              label: widgetSrc,
            }}
          />
        </div>
        <div className="source">
          <a
            href={`/mob.near/widget/WidgetSource?src=${widgetSrc}`}
            target="_blank"
            className="btn btn-outline-primary border-0"
          >
            Source
          </a>
        </div>
      </div>
      <label>Props</label>
      <table className="props table table-bordered mb-3">
        <thead>
          <tr>
            <th>Key</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {renderProps(c.requiredProps)}
          {renderProps(c.optionalProps, true)}
        </tbody>
      </table>
      <label>Example</label>
      <div className="embed-code">
        <Markdown text={`\`\`\`jsx\n${embedCode}\n\`\`\``} />
        <div className="embed-copy">
          <Widget
            src="mob.near/widget/CopyButton"
            props={{ text: embedCode, className: "btn btn-outline-light" }}
          />
        </div>
      </div>
    </div>
  );
};

const renderMenuItem = (c, i) => {
  const prev = i ? components[i - 1] : null;
  const res = [];
  if (!prev || prev.category !== c.category) {
    res.push(
      <h5 className="category" key={c.category}>
        {c.category}
      </h5>
    );
  }
  const id = c.title.toLowerCase().replaceAll(" ", "-");
  res.push(
    <div className="menu-item" key={i}>
      <a href={`#${id}`}>{c.title}</a>
    </div>
  );
  return res;
};

const Wrapper = styled.div`
@media(min-width: 992px) {
  .b-s {
    border-left: 1px solid #eee;
  }
  .b-e {
    border-right: 1px solid #eee;
  }
}
.category:not(:first-child) {
  margin-top: 1em;
}
.component {
  padding: 0.5em 12px;
  padding-bottom: 0;
  margin-bottom: 3em;
  margin: 0 -12px 3em;
  position: relative;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  .anchor {
    position: absolute;
    top: -70px;
  }

  table {
    background: white;
  }

  label {
    font-size: 20px;
  }

  .code {
    display: inline-flex;
    line-height: normal;
    border-radius: 0.3em;
    padding: 0 4px;
    border: 1px solid #ddd;
    background: rgba(0, 0, 0, 0.03);
    font-family: var(--bs-font-monospace);
  }
  .path {

  }
  .preview {
    background-color: white;
    padding: 12px;
    border: 1px solid #eee;
    border-radius: 12px;
    pre {
      margin-bottom: 0;
    }
  }
  .props {
    .prop-key {
      font-weight: 600;
      &.optional {
        font-weight: normal;
      }
    }
    .prop-desc {
      p {
        margin-bottom: 0;
      }
    }
  }
  .embed-code {
    position: relative;

    .embed-copy {
      position: absolute;
      top: 18px;
      right: 10px;
    }
  }
}
`;

return (
  <Wrapper>
    <h3>Social Components Library</h3>
    <div className="mb-3">
      This library contains common social components used by near.social
    </div>
    <div className="row">
      <div className="col-lg-3 b-e b-s">{components.map(renderMenuItem)}</div>
      <div className="col-lg-9 b-e">{components.map(renderComponent)}</div>
    </div>
  </Wrapper>
);