const path = props.path; // every piece of data on social contract has a path
const blockHeight = props.blockHeight || "final"; // and a blockHeight (~version)
const options = props.options;
if (!path) {
  return <p>No path provided.</p>;
}

// split the path
const parts = path.split("/");
const creatorId = parts[0];

let type;
if (parts.length === 1) {
  // every root of a path is an account
  type = "account";
} else {
  // otherwise the "standard" is the type (widget, post, type, thing...)
  // for thing, we'll extract the actual "Type" later
  type = parts[1];
}

State.init({
  view: "THING",
});

const Container = styled.div`
  border: 1px solid #ccc;
  height: fit-content;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid #ccc;
`;

const IconBox = styled.div`
  font-family: "Times New Roman";
  font-size: 2em;
  line-height: 1.25;
  font-weight: 400;
  cursor: pointer;
`;

const Content = styled.div`
  padding: 1px;
  min-height: 300px;
`;

const Button = styled.button`
  text-transform: lowercase !important;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
`;

// PLUGINS
// This should move to settings
const plugins = {
  EDIT: {
    state: {
      active: {
        icon: "bi bi-arrow-counterclockwise",
        label: "Cancel Edit",
      },
      inactive: {
        icon: "bi bi-pencil",
        label: "Edit",
      },
    },
    src: "efiz.near/widget/every.thing.edit",
    creatorRequired: true,
  },
  EDITV2: {
    state: {
      active: {
        icon: "bi bi-arrow-counterclockwise",
        label: "Cancel Edit",
      },
      inactive: {
        icon: "bi bi-pencil",
        label: "Edit v2",
      },
    },
    src: "efiz.near/widget/every.thing.editor.provider",
    creatorRequired: true,
  },
  RAW: {
    state: {
      active: {
        icon: "bi bi-arrow-up-left-circle",
        label: "Show Thing",
      },
      inactive: {
        icon: "bi bi-filetype-raw",
        label: "Raw",
      },
    },
    src: "efiz.near/widget/every.thing.raw",
  },
  HISTORY: {
    state: {
      active: {
        icon: "bi bi-clock",
        label: "Hide History",
      },
      inactive: {
        icon: "bi bi-clock-history",
        label: "Show History",
      },
    },
    src: "efiz.near/widget/Every.Thing.History",
  },
  DUPLICATE: {
    state: {
      active: {
        icon: "bi bi-arrow-counterclockwise",
        label: "Cancel Duplicate",
      },
      inactive: {
        icon: "bi bi-back",
        label: "Duplicate",
      },
    },
    src: "efiz.near/widget/every.thing.edit",
  },
  BUILD: {
    state: {
      active: {
        icon: "bi bi-arrow-counterclockwise",
        label: "Cancel Build",
      },
      inactive: {
        icon: "bi bi-hammer",
        label: "Build",
      },
    },
    src: "efiz.near/widget/every.thing.build",
    creatorRequired: true,
  },
  EDGES: {
    state: {
      active: {
        icon: "bi bi-arrow-counterclockwise",
        label: "Show Thing",
      },
      inactive: {
        icon: "bi bi-link",
        label: "Edges",
      },
    },
    src: "efiz.near/widget/every.edge",
  },
  CAMERA: {
    state: {
      active: {
        icon: "bi bi-arrow-counterclockwise",
        label: "Show Thing",
      },
      inactive: {
        icon: "bi bi-camera",
        label: "Camera",
      },
    },
    src: "efiz.near/widget/Camera",
    typeRequired: "every.near/type/marketplace",
  },
};

// DROPDOWN //
function Modifier() {
  const renderIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="black"
        width="24px"
        height="24px"
      >
        <circle cx="12" cy="12" r="8" />
      </svg>
    );
  };

  function createButton(key, data) {
    const stateVal = state.view === key ? "active" : "inactive";
    if (data.creatorRequired && context.accountId !== creatorId) {
      return <></>;
    } else {
      return (
        <button
          className={"btn"}
          onClick={() =>
            State.update({ view: stateVal === "active" ? "THING" : key })
          }
        >
          <i className={data.state[stateVal].icon}></i>
          {data.state[stateVal].label}
        </button>
      );
    }
  }

  function jutsu() {
    return (
      <a
        className={`btn`}
        href={`https://jutsu.ai/editor/${path}`}
        target="_blank"
      >
        <i className=" me-1">
          <svg
            focusable="false"
            aria-hidden="true"
            viewBox="2 2 18 18"
            width="16px"
            height="16px"
          >
            <path d="M12.16 3h-.32L9.21 8.25h5.58zm4.3 5.25h5.16l-2.07-4.14C19.21 3.43 18.52 3 17.76 3h-3.93l2.63 5.25zm4.92 1.5h-8.63V20.1zM11.25 20.1V9.75H2.62zM7.54 8.25 10.16 3H6.24c-.76 0-1.45.43-1.79 1.11L2.38 8.25h5.16z"></path>
          </svg>
        </i>
        <span>Open Jutsu</span>
      </a>
    );
  }

  return (
    <Widget
      src="efiz.near/widget/Common.Dropdown"
      props={{
        renderIcon: renderIcon,
        elements:
          type === "widget"
            ? [jutsu()]
            : Object.keys(plugins)?.map((it) => createButton(it, plugins[it])),
      }}
    />
  );
}

function Thing() {
  // Renders the path according to type
  switch (type) {
    case "thing": {
      // get the thing data
      const thing = JSON.parse(Social.get(path, blockHeight) || "null");
      type = thing.type || null;
      // get the type data
      const typeObj = JSON.parse(Social.get(type, blockHeight) || "null");
      if (typeObj === null) {
        console.log(
          `edge case: thing ${path} had an invalid type: ${thingType}`
        );
        typeObj = {
          widgets: {
            view: "every.near/widget/app", // this is temp cuz I know it's the app type
          },
        };
      }
      // const { get } = VM.require(thing.adapter || (() => {}));

      // if (get) {
      //   const passProps = get(thing.reference);
      //   console.log("passProps", passProps);
      //   return (<Widget src={widgetSrc} props={passProps} />);
      // }
      // determine the widget to render this thing (is there a default view?)
      const widgetSrc =
        options?.templateOverride ||
        thing.template?.src ||
        typeObj?.widgets?.view;
      // Template
      if (!widgetSrc) {
        return (
          <Widget
            src="efiz.near/widget/MonacoEditor"
            props={{
              code: JSON.stringify(thing),
              path,
              language: "javascript",
            }}
          />
        );
      }
      return (
        <Widget
          src={widgetSrc}
          props={{ data: thing, path, blockHeight }}
        />
      );
    }
    case "post": {
      return (
        <Widget
          src="every.near/widget/every.post.view"
          props={{
            path,
            blockHeight: a.blockHeight,
          }}
        />
      );
    }
    case "widget": {
      return <Widget src={path} props={props} />;
    }
    case "account": {
      return <Widget src="mob.near/widget/ProfilePage" props={{ accountId: path }} />;
    }
    case "settings": {
      // Standardize path to {accountId}/settings/**
      parts.splice(2);
      parts.push("**");
      path = parts.join("/");
      return (
        <Widget
          src="efiz.near/widget/Every.Setting"
          props={{ path, blockHeight }}
        />
      );
    }
    case "type": {
      return (
        <Widget
          src="every.near/widget/every.type.create"
          props={{ typeSrc: path }}
        />
      );
    }
  }
  // DEFAULT:
  return <p>The type: {type} is not yet supported.</p>;
}

function Plugin() {
  const plugin = plugins[state.view];
  return (
    <Container>
      <Header style={{ justifyContent: "flex-start" }}>
        <Button
          onClick={() => {
            State.update({ view: "THING" });
          }}
        >
          back
        </Button>
      </Header>
      <Widget src={plugin.src} props={{ path, blockHeight }} />
    </Container>
  );
}

return (
  <Container id={path}>
    <Header>
      <ButtonRow>
        <Modifier />
      </ButtonRow>
    </Header>
    <Content>{state.view === "THING" ? <Thing /> : <Plugin />}</Content>
  </Container>
);
