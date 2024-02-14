const routes = props.routes;
if (!routes) {
  routes = [];
}
const Navigator = props.Navigator;

State.init({
  CurrentWidget: null,
});

function init() {
  if (!state.CurrentWidget) {
    // TODO: check from local storage or props
    const initialSrc = Object.values(props.routes)[0].src;
    State.update({ CurrentWidget: initialSrc });
    // () => <Widget src={initialSrc.path} blockHeight={initialSrc.blockHeight} />
  }
}

init();

// Function to handle navigation
function handleNavigate(newRoute, passProps) {
  const currentSrc = props.routes[newRoute]?.src;
  State.update({ CurrentWidget: currentSrc, passProps });
}

// const activePage = pages.find((p) => p.active);

// const navigate = (v, params) => {
//   State.update({ page: v, project: params?.project });
//   const url = Url.construct("#//*__@appAccount__*//widget/home", params);
//   Storage.set("url", url);
// };

function RouterLink({ to, children, passProps }) {
  return (
    <span
      onClick={() => handleNavigate(to, passProps)}
      key={"link-to-" + to}
      style={{ cursor: "pointer" }}
    >
      {children}
    </span>
  );
}

// Render the current widget or a default message if the route is not found
return (
  <div>
    {/* Navigation buttons -- this should be passed to a Navigator widget */}
    <div>
      <Widget
        src={Navigator.src.path || "devs.near/widget/Navigator"}
        blockHeight={Navigator.src.blockHeight || "final"}
        props={{ RouterLink, routes: props.routes }}
      />
    </div>
    {/** This could already render all of the children, but just put them as display none (lazy loading) */}
    {state.CurrentWidget ? (
      <Widget
        src={state.CurrentWidget.path}
        blockHeight={state.CurrentWidget.blockHeight}
        props={{ RouterLink, ...state.passProps }}
      />
    ) : (
      <div>{JSON.stringify(state.CurrentWidget)}</div>
    )}
  </div>
);