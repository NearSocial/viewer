const accountId = props.accountId;

if (!accountId) {
  return "";
}

const following = Social.keys(`${accountId}/graph/follow/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

const followers = Social.keys(`*/graph/follow/${accountId}`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

const numFollowing = following
  ? Object.keys(following[accountId].graph.follow || {}).length
  : null;
const numFollowers = followers ? Object.keys(followers || {}).length : null;

return (
  <div>
    <div className="d-flex flex-row align-items-center">
      <div className="me-3" style={{ fontSize: 14 }}>
        <span>
          {numFollowing !== null ? (
            <span
              className="fw-bolder"
              style={{ color: "var(--font-color, #fff)" }}
            >
              {numFollowing}
            </span>
          ) : (
            "?"
          )}{" "}
          <span style={{ color: "var(--White-50, #B0B0B0)" }}>Following</span>
        </span>
      </div>
      <div style={{ fontSize: 14 }}>
        <span>
          {numFollowers !== null ? (
            <span
              style={{ color: "var(--font-color, #fff)" }}
              className="fw-bolder"
            >
              {numFollowers}
            </span>
          ) : (
            "?"
          )}{" "}
          <span style={{ color: "var(--White-50, #B0B0B0)" }}>
            Follower{numFollowers !== 1 && "s"}
          </span>
        </span>
      </div>
    </div>
  </div>
);
