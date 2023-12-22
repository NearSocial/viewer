const { accountId, name, type, metadata, plugin } = props;

const installedEmbeds = JSON.parse(
  Social.get(`${accountId}/settings/every/embed`, "final") || "null"
);

if (plugin) {
  return (
    <div
      className="card"
      style={{
        maxWidth: "100%",
        height: "200px",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <div>
        <p>widgetSrc: {plugin.widgetSrc}</p>
        <p>embedSrc: {plugin.embedSrc}</p>
      </div>
      {context.accountId && (
        <div
          className="pb-2"
          style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}
        >
          <button
            onClick={() =>
              Social.set({
                settings: {
                  every: {
                    embed: [
                      ...(installedEmbeds || []),
                      {
                        widgetSrc: plugin.widgetSrc,
                        embedSrc: plugin.embedSrc,
                      },
                    ],
                  },
                },
              })
            }
          >
            install
          </button>
          <Widget
            src="mob.near/widget/N.StarButton"
            props={{
              notifyAccountId: accountId,
              item: {
                type: "social",
                path: `${accountId}/${type}/${name}`,
              },
            }}
          />
          <Widget
            src="mob.near/widget/N.LikeButton"
            props={{
              notifyAccountId: accountId,
              item: {
                type: "social",
                path: `${accountId}/${type}/${name}`,
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
const data = JSON.parse(
  Social.get(`${accountId}/plugin/embed/${name}`, "final") || "null"
);

if (!data) {
  return <p>Loading... {`${accountId}/plugin/embed/${name}`}</p>;
}

// Use metadata.name if it exists, otherwise use the passed name
const displayName = metadata.name || name;
const defaultImage =
  "https://ipfs.near.social/ipfs/bafkreihi3qh72njb3ejg7t2mbxuho2vk447kzkvpjtmulsb2njd6m2cfgi";

return (
  <div
    className="card"
    style={{
      maxWidth: "100%",
      height: "300px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      overflow: "hidden",
    }}
  >
    <div
      className="card-img-top"
      style={{
        backgroundImage: `url(${metadata.backgroundImage || defaultImage})`,
        height: "80px",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />

    <div className="card-body">
      <Link
        to={`/${accountId}/plugin/embed/${name}`}
        style={{ textDecoration: "none" }}
      >
        <h5 className="card-title">
          {accountId}/{displayName}
        </h5>
      </Link>
      {metadata.description && (
        <p
          className="card-text"
          style={{ overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {metadata.description}
        </p>
      )}
      {data && (
        <>
          <p>widgetSrc: {data.widgetSrc}</p>
          <p>embedSrc: {data.embedSrc}</p>
        </>
      )}
    </div>
    {context.accountId && (
      <div
        className="pb-2"
        style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}
      >
        <button
          onClick={() =>
            Social.set({
              settings: {
                every: {
                  embed: [
                    ...(installedEmbeds || []),
                    {
                      widgetSrc: data.widgetSrc,
                      embedSrc: data.embedSrc,
                    },
                  ],
                },
              },
            })
          }
        >
          install
        </button>
        <Widget
          src="mob.near/widget/N.StarButton"
          props={{
            notifyAccountId: accountId,
            item: {
              type: "social",
              path: `${accountId}/${type}/${name}`,
            },
          }}
        />
        <Widget
          src="mob.near/widget/N.LikeButton"
          props={{
            notifyAccountId: accountId,
            item: {
              type: "social",
              path: `${accountId}/${type}/${name}`,
            },
          }}
        />
      </div>
    )}
  </div>
);
