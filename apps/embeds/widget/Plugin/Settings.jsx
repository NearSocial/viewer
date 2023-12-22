const accountId = context.accountId;

const installedEmbeds = JSON.parse(
  Social.get(`${accountId}/settings/every/embed`, "final") || "null"
);

if (!installedEmbeds) {
  return <p>no embeds installed</p>;
}

const defaultImage =
  "https://ipfs.near.social/ipfs/bafkreihi3qh72njb3ejg7t2mbxuho2vk447kzkvpjtmulsb2njd6m2cfgi";

return (
  <>
    {installedEmbeds.map(
      (
        embed // EmbedPlugin
      ) => (
        <div
          className="card"
          style={{
            maxWidth: "300px",
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
              backgroundImage: `url(${defaultImage})`,
              height: "80px",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="card-body">
            <p>widgetSrc: {embed.widgetSrc}</p>
            <p>embedSrc: {embed.embedSrc}</p>
          </div>
          {context.accountId && (
            <div
              className="pb-2"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "4px",
              }}
            >
              <button
                onClick={() =>
                  Social.set({
                    settings: {
                      every: {
                        embed: installedEmbeds.filter(
                          (it) => it.widgetSrc !== embed.widgetSrc
                        ),
                      },
                    },
                  })
                }
              >
                uninstall
              </button>
            </div>
          )}
        </div>
      )
    )}
  </>
);
