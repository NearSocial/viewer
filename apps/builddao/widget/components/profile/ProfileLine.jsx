const accountId = props.accountId;
const link = props.link ?? true;
const hideAccountId = props.hideAccountId;
const hideName = props.hideName;
const hideImage = props.hideImage;

const profile = props.profile ?? Social.getr(`${accountId}/profile`);
const fast = !!props.fast || (!props.profile && accountId);

const name = profile.name ?? accountId;
const title = props.title ?? `${name} @${accountId}`;
const tooltip =
  props.tooltip && (props.tooltip === true ? title : props.tooltip);

const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => {},
};

let inner = (
  <>
    {!hideImage && (
      <Widget
        key="image"
        src="mob.near/widget/ProfileImage"
        props={{
          fast,
          style: { width: "1.5em", height: "1.5em", marginRight: "0.1em" },
          profile,
          accountId,
          className: "d-inline-block",
          imageClassName: "rounded w-100 h-100 align-top",
        }}
      />
    )}
    {!hideAccountId && (
      <span key="accountId" className="ms-1">
        @{accountId}
      </span>
    )}
  </>
);

inner = link ? (
  <Link
    href={
      link !== true
        ? link
        : href({
            widgetSrc: "buildhub.near/widget/app",
            params: {
              page: "profile",
              accountId,
            },
          })
    }
    style={{ color: "var(--font-color, #fff)" }}
    className="text-white text-truncate d-inline-flex"
  >
    {inner}
  </Link>
) : (
  <span className="text-truncate d-inline-flex">{inner}</span>
);

if (props.tooltip === true) {
  return (
    <Widget
      src="mob.near/widget/Profile.OverlayTrigger"
      props={{ accountId, children: inner }}
    />
  );
}
if (tooltip) {
  inner = (
    <OverlayTrigger placement="auto" overlay={<Tooltip>{tooltip}</Tooltip>}>
      {inner}
    </OverlayTrigger>
  );
}

return inner;
