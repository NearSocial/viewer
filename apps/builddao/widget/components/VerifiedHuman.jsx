const accountId = props.accountId;

if (!accountId) {
  return "";
}

Near.asyncView("v1.nadabot.near", "is_human", { account_id: accountId }).then(
  (result) => {
    State.update({ human: result });
  },
);

const VerifiedHuman = state.human ? (
  <span style={{ verticalAlign: center }}>
    <span className="ms-1 text-primary">
      <i className="bi bi-check-circle-fill"></i>
    </span>
  </span>
) : (
  ""
);

return (
  <Widget
    loading={VerifiedHuman}
    src="mob.near/widget/N.Common.OverlayTrigger"
    props={{
      popup: <div>Verified Human!</div>,
      children: VerifiedHuman,
    }}
  />
);
