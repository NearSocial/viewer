const { Button } =
  VM.require("buildhub.near/widget/components") || (() => <></>);
const { href } = VM.require("buildhub.near/widget/lib.url") || (() => null);

return (
  <div>
    <Link
      to={href({
        widgetSrc: "buildhub.near/widget/app",
        params: {
          page: "home",
        },
      })}
    >
      <Button variant="primary">Go Back</Button>
    </Link>
  </div>
);
