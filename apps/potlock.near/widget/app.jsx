
const routes = {
  home: {
    path: "potlock.near/widget/Project.ListPage",
    init: {
      ownerId,
      registryContractId,
      donationContractId,
      potFactoryContractId,
      nadabotContractId,
      ...passProps,
    },
  },
  createproject: {
    path: "potlock.near/widget/Project.Create",
    init: {
      ownerId,
      registryContractId,
      donationContractId,
      potFactoryContractId,
      nadabotContractId,
      ...passProps,
    },
  },
  editproject: {
    path: "potlock.near/widget/Project.Create",
    init: {
      edit: true,
      ownerId,
      registryContractId,
      donationContractId,
      potFactoryContractId,
      nadabotContractId,
      ...passProps,
    },
  },
  projects: {
    path: "potlock.near/widget/Project.ListPage",
    init: {
      ownerId,
      registryContractId,
      donationContractId,
      potFactoryContractId,
      nadabotContractId,
      ...passProps,
    },
  },
  project: {
    path: "potlock.near/widget/Project.Detail",
    init: {
      ownerId,
      registryContractId,
      donationContractId,
      potFactoryContractId,
      nadabotContractId,
      ...passProps,
    },
  },
  cart: {
    path: "potlock.near/widget/Cart.Checkout",
    init: {
      ownerId,
      registryContractId,
      donationContractId,
      potFactoryContractId,
      nadabotContractId,
      ...passProps,
    },
  },
  feed: {
    path: "potlock.near/widget/Components.Feed",
    init: {
      ownerId,
      registryContractId,
      donationContractId,
      potFactoryContractId,
      nadabotContractId,
      ...passProps,
    },
  },
  pots: {
    path: "potlock.near/widget/Pots.Home",
    init: {
      ownerId,
      registryContractId,
      donationContractId,
      potFactoryContractId,
      nadabotContractId,
      ...passProps,
    },
  },
  deploypot: {
    path: "potlock.near/widget/Pots.Deploy",
    init: {
      ownerId,
      registryContractId,
      donationContractId,
      potFactoryContractId,
      nadabotContractId,
      ...passProps,
    },
  },
  pot: {
    path: "potlock.near/widget/Pots.Detail",
    init: {
      ownerId,
      registryContractId,
      donationContractId,
      potFactoryContractId,
      nadabotContractId,
      ...passProps,
    },
  },
  donors: {
    path: "potlock.near/widget/Components.Donors",
    init: {
      ownerId,
      registryContractId,
      donationContractId,
      potFactoryContractId,
      nadabotContractId,
      ...passProps,
    },
  },
  profile: {
    path: "potlock.near/widget/Profile.Detail",
    init: {
      ownerId,
      registryContractId,
      donationContractId,
      potFactoryContractId,
      nadabotContractId,
      ...passProps,
    },
  },
};

const Theme = styled.div`
  position: relative;
  * {
    font-family: "Mona-Sans";
    font-style: normal;
    font-weight: 400;
  }
  @font-face {
    font-family: mona-sans;
    font-style: normal;
    font-weight: 400;
    src: local("Mona-Sans"),
      url(https://fonts.cdnfonts.com/s/91271/Mona-Sans-Regular.woff) format("woff");
  }
  @font-face {
    font-family: mona-sans;
    font-style: normal;
    font-weight: 500;
    src: local("Mona-Sans"),
      url(https://fonts.cdnfonts.com/s/91271/Mona-Sans-Medium.woff) format("woff");
  }
  @font-face {
    font-family: mona-sans;
    font-style: normal;
    font-weight: 600;
    src: local("Mona-Sans"),
      url(https://fonts.cdnfonts.com/s/91271/Mona-Sans-SemiBold.woff) format("woff");
  }
  @font-face {
    font-family: mona-sans;
    font-style: normal;
    font-weight: 700;
    src: local("Mona-Sans"),
      url(https://fonts.cdnfonts.com/s/91271/Mona-Sans-Bold.woff) format("woff");
  }
`;

const { App } = VM.require("devs.near/widget/App") || {
  App: () => <></>,
};

const { AppLayout } = VM.require("buildhub.near/widget/template.AppLayout") || {
  AppLayout: () => <></>,
};

if (!tab) tab = Object.keys(routes)[0] || "home";

// const isForm = [CREATE_PROJECT_TAB].includes(props.tab);

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  // padding: 3em;
  border-radius: 0rem 0rem 1.5rem 1.5rem;
  border-top: 1px solid var(--ui-elements-light, #eceef0);
  background: var(--base-white, #fff);

  &.form {
    border: none;
    background: #fafafa;
  }
`;

return (
  <Theme>
    <App
      {...props} // what else might it need?
      routes={routes}
      debug={false}
      defaultPage="home"
      routerParam="tab" // router config
      basePath={context.widgetSrc ?? `${ownerId}/widget/Index`} // TODO: context from VM or custom component for Link
      Layout={({ children, navigate, Outlet, ...p }) => {
        // we MUST pass "children" here, I wonder why?
        
        // This should just be Template
        const { AppLayout } = VM.require(
          "every.near/widget/template.app" // choose your template, although this one is standard
        ) || { AppLayout: () => <></> };
        return (
          <AppLayout
            Header={({ page }) => {
              return (
                <Widget
                  src={`${ownerId}/widget/Components.Nav`}
                  props={{ ownerId, page, routes, navigate, ...props }}
                  loading={<div style={{ height: "100%", width: "100%" }} />}
                />
              );
            }}
            Footer={() => <></>}
            {...p}
          >
            {/* // Outlet is helpful if you want to provide functions to the child */}
            <Outlet page={page} {...p} />
          </AppLayout>
        );
      }}
      Provider={({ children }) => children} // something to explore/context
    />
  </Theme>
);