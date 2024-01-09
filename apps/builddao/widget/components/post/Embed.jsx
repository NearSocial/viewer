// This widget is used for embedding whitelisted set of widgets into a post body.

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

const href = props.href;

const parseUrl = (url) => {
  if (typeof url !== "string") {
    return null;
  }
  if (url.startsWith("/")) {
    url = `https://near.social${url}`;
  }
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

const parsed = useMemo(() => {
  const url = parseUrl(href);
  if (!url) {
    return null;
  }
  return {
    widgetSrc: url.pathname.substring(1),
    props: Object.fromEntries([...url.searchParams.entries()]),
  };
}, [href]);

if (!parsed || !EmbedMap.has(parsed.widgetSrc)) {
  return <a href={href}>{props.children}</a>;
}

const widgetSrc = EmbedMap.get(parsed.widgetSrc);

const Wrapper = styled.div`
  border-radius: 1rem;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  white-space: normal;
  margin-top: 12px;
`;

return (
  <Wrapper>
    <Widget loading="" src={widgetSrc} props={parsed.props} />
  </Wrapper>
);
