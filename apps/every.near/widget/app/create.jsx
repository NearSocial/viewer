const accountId = props.accountId ?? context.accountId;

const defaultRoutes = Social.getr("every.near/widget/app/config/routes") ?? {
  main: {
    path: "hack.near/widget/page.index",
    blockHeight: "final",
    init: {
      name: "Home",
    },
  },
  docs: {
    path: "hack.near/widget/page.docs",
    blockHeight: "final",
    init: {
      name: "Docs",
    },
  },
  social: {
    path: "hack.near/widget/page.feed",
    blockHeight: "final",
    init: {
      name: "Feed",
    },
  },
};

State.init({
  name,
  routes: props.routes ?? defaultRoutes,
  routePath: "",
  pageId: "",
  buttonText: "",
});

function generateUID() {
  return (
    Math.random().toString(16).slice(2) +
    Date.now().toString(36) +
    Math.random().toString(16).slice(2)
  );
}

const { page, tab, ...passProps } = props;

const { AppLayout } = VM.require("hack.near/widget/template.main") || {
  AppLayout: () => <></>,
};

if (!page) page = Object.keys(state.routes)[0] || "main";

function Router({ active, routes }) {
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
      return <p>NOTHING FOUND</p>;
    }
  }

  return (
    <div key={active}>
      <Widget
        src={src}
        props={{
          currentPath: `/hack.near/widget/app.create?page=${page}`,
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
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

const handleCreate = () =>
  Social.set({
    widget: {
      app: {
        "": `const accountId = props.accountId ?? context.accountId; const creatorId = props.creatorId ?? "${
          context.accountId
        }"; const pageId = props.pageId ?? "${
          state.name || generateUID()
        }"; return <Widget src="every.near/widget/app" props={{ accountId }} />`,
        metadata: {
          name: state.name,
          image: state.image,
          tags: {
            build: "",
          },
        },
        config: {
          type: "app",
          routes: state.routes,
        },
      },
    },
  });

function addRoute(newRouteKey, newRouteData) {
  State.update({
    routes: { ...state.routes, [newRouteKey]: newRouteData },
  });
}

function removeRoute(routeKey) {
  const updatedRoutes = { ...state.routes };
  delete updatedRoutes[routeKey];

  State.update({
    routes: updatedRoutes,
  });
}

const isValid = Social.get(`${state.routePath}/**`);

const routeData = {
  [state.pageId]: {
    path: [state.routePath],
    blockHeight: "final",
    init: {
      name: [state.buttonText ?? state.pageId],
    },
  },
};

return (
  <>
    <div className="m-2">
      <h3>Create App</h3>
      <p>
        <i>
          This no-code builder can help anyone launch their own project based on
          a common data structure for open web apps, courtesy of
          <a href="https://everything.dev">everything.dev</a> and{" "}
          <a href="https://nearbuilders.org">Build DAO</a>
          contributors.
        </i>
      </p>
    </div>
    <div className="row">
      <div className="col-5">
        <div className="m-2">
          <h5 className="mb-2">Name</h5>
          <div className="mb-3 p-1">
            <input type="text" placeholder="unique title" value={state.name} />
          </div>
          <h5 className="mb-2">Logo</h5>

          <div className="p-1">
            <Widget
              src="mob.near/widget/ImageEditorTabs"
              props={{
                image: state.image,
                onChange: (image) => State.update({ image }),
              }}
            />
          </div>
        </div>
      </div>
      <div className="col-7">
        <div className="m-2">
          <h5 className="mb-2">Routes</h5>

          <div className="d-flex flex-row gap-3 p-1">
            <input
              placeholder="page ID"
              onChange={(e) => State.update({ pageId: e.target.value })}
            />
            <input
              placeholder="button text"
              onChange={(e) => State.update({ buttonText: e.target.value })}
            />
          </div>
          <div className="d-flex flex-row gap-3 p-1">
            <input
              placeholder="source path"
              onChange={(e) => State.update({ routePath: e.target.value })}
            />
            <button
              className="btn btn-dark"
              disabled={!isValid || state.pageId == ""}
              onClick={() => {
                const newRouteData = {
                  path: state.routePath,
                  blockHeight: "final",
                  init: {
                    name: state.buttonText || state.pageId,
                  },
                };
                addRoute(state.pageId, newRouteData);
              }}
            >
              +
            </button>
          </div>
        </div>

        <div>
          {Object.keys(state.routes).map((key) => {
            const route = state.routes[key];
            return (
              <div className="d-flex m-2 p-1 justify-content-between align-items-center">
                <Widget
                  src="hack.near/widget/template.inline"
                  props={{ src: route.path }}
                />
                <button
                  className="btn btn-outline-danger"
                  onClick={() => removeRoute(key)}
                >
                  X
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    <div className="m-2">
      <button
        style={{ width: "100%" }}
        className="btn btn-success m-1 mb-3"
        disabled={!context.accountId}
        onClick={handleCreate}
      >
        Launch
      </button>
    </div>
    <div className="m-2">
      <h5>Preview</h5>
      <hr />
      <Widget src="hack.near/widget/app" props={{ routes: state.routes }} />
    </div>
  </>
);