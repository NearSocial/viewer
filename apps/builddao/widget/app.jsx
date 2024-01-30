const { page, tab, layout, loading, ...passProps } = props;

const { routes } = {
  type: "app",
  routes: {
    home: {
      path: "buildhub.near/widget/page.home",
      blockHeight: "final",
      init: {
        name: "Home",
      },
    },
    about: {
      path: "buildhub.near/widget/page.about",
      blockHeight: "final",
      init: {
        name: "About",
      },
    },
    feed: {
      path: "buildhub.near/widget/page.feed",
      blockHeight: "final",
      init: {
        name: "Feed",
      },
    },
    proposal: {
      path: "buildhub.near/widget/page.proposals",
      blockHeight: "final",
      init: {
        name: "Proposals",
      },
    },
  },
};

// const { theme } = VM.require("buildhub.near/widget/config.theme") ?? {
//   theme: {},
// };

const { AppLayout } = VM.require("buildhub.near/widget/template.AppLayout") || {
  AppLayout: () => <>Layout loading...</>,
};

const { Router } = VM.require("devs.near/widget/Router") || {
  Router: () => <>Router loading...</>,
}

if (!page) page = Object.keys(routes)[0] || "home";

const Root = styled.div`
 // can come from config
`;

// const [activeRoute, setActiveRoute] = useState(page);

// useEffect(() => {
//   setActiveRoute(page);
// }, [page]);



const Container = styled.div`
  display: flex;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

return (
  <Root>
    <Container>
      <AppLayout page={page} routes={routes}>
        <Content>
          <Router active={page} routes={routes} />
        </Content>
      </AppLayout>
    </Container>
  </Root>
);
