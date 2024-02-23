const { App } = VM.require("devs.near/widget/App") || {
  App: () => <></>,
};

const { ContextMenu } = VM.require("devs.near/widget/ContextMenu") || {
  ContextMenu: () => <></>,
};

const { routes } = {
  type: "every.near/type/app",
  routes: {
    tree: {
      path: "buildhub.near/widget/app",
      blockHeight: "final",
      init: {},
    },
    draw: {
      path: "every.near/widget/app",
      blockHeight: "final",
      init: {},
    },
  },
};

const Theme = styled.div`
  // background-color: black;
`;

// what if we could provide the component library?

return (
  <Theme>
    <ContextMenu
      Item={() => (
        <App
          {...props} // what else might it need?
          routes={routes}
          debug={false}
          basePath={context.widgetSrc ?? "every.near/widget/app.fun"} // TODO: context from VM or custom component for Link
          Layout={({ children, Outlet, ...p }) => {
            const { AppLayout } = VM.require(
              "every.near/widget/template.app" // choose your template
            ) || { AppLayout: () => <>hello</> };
            return (
              <AppLayout
                // populate layout's props
                Header={({ NavLink }) => <NavLink to={"tree"}>tree</NavLink>}
                Footer={({ NavLink }) => <NavLink to={"draw"}>darw</NavLink>}
                {...p}
              >
                <Outlet />
              </AppLayout>
            );
          }}
          Provider={({ children }) => children} // something to explore/context
        />
      )}
      passProps={{
        // PROPS THAT WILL BE PASSED TO FUNCTION
        doSomething: { message: "hello world" },
      }}
      handlers={{
        // FUNCTION DEFINITIONS
        doSomething: ({ message }) => {
          console.log(message);
        },
      }}
      items={{
        // MENU ITEM TO RENDER, WILL CALL FUNCTION WHEN CLICKED
        doSomething: () => (
          <>
            <i className="menu__item__icon bi bi-x-lg" />
            Do Something
          </>
        ),
      }}
    />
  </Theme>
);
