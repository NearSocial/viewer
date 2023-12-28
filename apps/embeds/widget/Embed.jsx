const Wrapper = styled.div`
  border-radius: 0.5em;
  width: 100%;
  white-space: normal;
  margin-top: 12px;
`;

const accountId = context.accountId;

// Default Embeds
const EmbedMap = new Map([
  [
    "mob.near/widget/MainPage.N.Post.Page",
    "mob.near/widget/MainPage.N.Post.Embed",
  ],
  [
    "mob.near/widget/MainPage.N.Post.Embed",
    "mob.near/widget/MainPage.N.Post.Embed",
  ],
]);

if (accountId) {
  const installedEmbeds = JSON.parse(
    Social.get(`${accountId}/settings/every/embed`, "final") || "null"
  );

  if (installedEmbeds) {
    installedEmbeds.forEach((embed) => {
      EmbedMap.set(embed.widgetSrc, embed.embedSrc);
    });
  }
}

const href = props.href;

const assertString = s => {
  if (typeof s !== "string") {
    return null;
  }  
}

// checks for use of "**" in widgetSrc string
const containsGlob = path => /\*\*/.test(path)

const findWithKey = (key, href) => {
  let fragments = key.split('**').filter(f => f != '')
  const hasFragment = (str, fragment) => str.search(fragment) != -1
  while (fragments.length > 0) {
    if (hasFragment(href, fragments[0])) {
      fragments.shift()
    } else {
      return null
    }
  }
  return true
}

const parseUrl = (url) => {
  assertString(url)
  if (url.startsWith("/")) {
    url = `https://near.social${url}`;
  }
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

const parseGlob = (path) => {
  assertString(path)
  const keysWithGlobs = [...EmbedMap.keys()].filter(key => containsGlob(key))
  const keysThatMatch = keysWithGlobs.filter(key => findWithKey(key,href))
  if (keysThatMatch.length >= 1) {
    try {
      return keysThatMatch[0]
    } catch {
      return null
    }
  }
  return null
};

const parsed = useMemo(() => {
  // try parsing embed link to URL
  const url = parseUrl(href);
  if (!!url) {
    return {
      widgetSrc: url.pathname.substring(1),
      props: Object.fromEntries([...url.searchParams.entries()]),
    };
  }

  // try parsing embed link to glob if url failed
  const widgetSrc = parseGlob(href)
  if (!!widgetSrc) {
    return {
      widgetSrc,
      props: {
        href,
      },
    };
  }

  // neither valid url nor valid glob
  return null;
}, [href]);

function filterByWidgetSrc(obj, widgetSrcValue) {
  let result = [];

  function recurse(currentObj) {
    if (typeof currentObj === "object" && currentObj !== null) {
      if (
        currentObj.metadata &&
        currentObj.metadata.widgetSrc === widgetSrcValue
      ) {
        result.push(currentObj);
      }
      Object.values(currentObj).forEach((value) => recurse(value));
    }
  }

  recurse(obj);
  return result;
}

if (!parsed || !EmbedMap.has(parsed.widgetSrc)) {
  return (
    <Wrapper>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <div className="text-center">
          <p>You do not have a plugin installed to render this embedding.</p>
          <Link
            to={`/embeds.near/widget/Plugin.Index?type=embed&widgetSrc=${parsed.widgetSrc}`}
            className="btn btn-primary mb-3"
          >
            <i className="bi bi-plug" /> Install one from the marketplace
            &#8594;
          </Link>
          <div>
            <span>
              {`or `}
              <a href={href} target="_blank" rel="noopener noreferrer">
                click here
              </a>
              {` to view`}
            </span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const widgetSrc = EmbedMap.get(parsed.widgetSrc);
return (
  <Wrapper>
    <Widget loading="" src={widgetSrc} props={parsed.props} />
  </Wrapper>
);
