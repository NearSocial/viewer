const { page, tab, ...passProps } = props;

const { routes } = VM.require("${config_account}/widget/config.app") ?? {
  routes: {},
};

const { AppLayout } = VM.require(
  "${config_account}/widget/template.AppLayout",
) || {
  AppLayout: () => <></>,
};

if (!page) page = Object.keys(routes)[0] || "home";

const Root = styled.div`
  --stroke-color: rgba(255, 255, 255, 0.2);
  --bg-1: #000;
  --bg-1-hover: #010002;
  --bg-1-hover-transparent: rgba(13, 2, 15, 0);
  --bg-2: #23242b;
  --label-color: #fff;
  --font-color: #fff;
  --font-muted-color: #cdd0d5;
  --black: #000;
  --system-red: #fd2a5c;
  --yellow: #eca227;

  --compose-bg: #23242b;

  --post-bg: #23242b;
  --post-bg-hover: #1d1f25;
  --post-bg-transparent: rgba(23, 24, 28, 0);

  --button-primary-bg: #eca227;
  --button-outline-bg: transparent;
  --button-default-bg: #23242b;

  --button-primary-color: #000;
  --button-outline-color: #fff;
  --button-default-color: #fff;

  --button-primary-hover-bg: #e49b48;
  --button-outline-hover-bg: rgba(255, 255, 255, 0.2);
  --button-default-hover-bg: #17181c;

  /* Poppins Font */
  @font-face {
    font-family: "Poppins";
    font-weight: 100;
    font-style: normal;
    src: url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Thin.eot");
    src:
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Thin.eot?#iefix")
        format("embedded-opentype"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Thin.woff2")
        format("woff2"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Thin.woff")
        format("woff"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Thin.ttf")
        format("truetype");
    font-display: swap;
  }
  @font-face {
    font-family: "Poppins";
    font-weight: 200;
    font-style: normal;
    src: url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-ExtraLight.eot");
    src:
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-ExtraLight.eot?#iefix")
        format("embedded-opentype"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-ExtraLight.woff2")
        format("woff2"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-ExtraLight.woff")
        format("woff"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-ExtraLight.ttf")
        format("truetype");
    font-display: swap;
  }
  @font-face {
    font-family: "Poppins";
    font-weight: 300;
    font-style: normal;
    src: url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Light.eot");
    src:
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Light.eot?#iefix")
        format("embedded-opentype"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Light.woff2")
        format("woff2"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Light.woff")
        format("woff"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Light.ttf")
        format("truetype");
    font-display: swap;
  }
  @font-face {
    font-family: "Poppins";
    font-weight: 400;
    font-style: normal;
    src: url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Regular.eot");
    src:
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Regular.eot?#iefix")
        format("embedded-opentype"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Regular.woff2")
        format("woff2"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Regular.woff")
        format("woff"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Regular.ttf")
        format("truetype");
    font-display: swap;
  }
  @font-face {
    font-family: "Poppins";
    font-weight: 500;
    font-style: normal;
    src: url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Medium.eot");
    src:
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Medium.eot?#iefix")
        format("embedded-opentype"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Medium.woff2")
        format("woff2"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Medium.woff")
        format("woff"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Medium.ttf")
        format("truetype");
    font-display: swap;
  }
  @font-face {
    font-family: "Poppins";
    font-weight: 600;
    font-style: normal;
    src: url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-SemiBold.eot");
    src:
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-SemiBold.eot?#iefix")
        format("embedded-opentype"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-SemiBold.woff2")
        format("woff2"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-SemiBold.woff")
        format("woff"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-SemiBold.ttf")
        format("truetype");
    font-display: swap;
  }
  @font-face {
    font-family: "Poppins";
    font-weight: 700;
    font-style: normal;
    src: url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Bold.eot");
    src:
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Bold.eot?#iefix")
        format("embedded-opentype"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Bold.woff2")
        format("woff2"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Bold.woff")
        format("woff"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Bold.ttf")
        format("truetype");
    font-display: swap;
  }
  @font-face {
    font-family: "Poppins";
    font-weight: 800;
    font-style: normal;
    src: url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-ExtraBold.eot");
    src:
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-ExtraBold.eot?#iefix")
        format("embedded-opentype"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-ExtraBold.woff2")
        format("woff2"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-ExtraBold.woff")
        format("woff"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-ExtraBold.ttf")
        format("truetype");
    font-display: swap;
  }
  @font-face {
    font-family: "Poppins";
    font-weight: 900;
    font-style: normal;
    src: url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Black.eot");
    src:
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Black.eot?#iefix")
        format("embedded-opentype"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Black.woff2")
        format("woff2"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Black.woff")
        format("woff"),
      url("https://cdn.jsdelivr.net/gh/webfontworld/Poppins/Poppins-Black.ttf")
        format("truetype");
    font-display: swap;
  }

  /* Inter Font */
  @font-face {
    font-family: InterVariable;
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    src: url("https://rsms.me/inter/font-files/InterVariable.woff2?v=4.0")
      format("woff2");
  }
  @font-face {
    font-family: InterVariable;
    font-style: italic;
    font-weight: 100 900;
    font-display: swap;
    src: url("https://rsms.me/inter/font-files/InterVariable-Italic.woff2?v=4.0")
      format("woff2");
  }

  /* Typeahead Fix */
  .rbt-token-removeable {
    background: #007bff;
    color: #fff;
  }
`;

function Router({ active, routes }) {
  // this may be converted to a module at devs.near/widget/Router
  const routeParts = active.split(".");

  let currentRoute = routes;
  let src = "";
  let defaultProps = {};

  for (let part of routeParts) {
    if (currentRoute[part]) {
      currentRoute = currentRoute[part];
      src = currentRoute.path;

      if (currentRoute.init) {
        defaultProps = { ...defaultProps, ...currentRoute.init };
      }
    } else {
      // Handle 404 or default case for unknown routes
      return <p>404 Not Found</p>;
    }
  }

  return (
    <div key={active}>
      <Widget
        src={src}
        props={{
          currentPath: `/${config_account}/widget/app?page=${page}`,
          page: tab,
          ...passProps,
          ...defaultProps,
        }}
      />
    </div>
  );
}

const Container = styled.div`
  display: flex;
  height: 100%;
  font-family: InterVariable, sans-serif;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

return (
  <Root>
    <Container>
      <AppLayout page={page} routes={routes} {...props}>
        <Content>
          <Router active={page} routes={routes} />
        </Content>
      </AppLayout>
    </Container>
  </Root>
);
