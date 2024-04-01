const { Avatar } = VM.require("${config_account}/widget/components") || {
  Avatar: () => <></>,
};

const ProfileImages = ({ accountIds }) => {
  if (accountIds.length < 1) {
    return "";
  }

  if (accountIds.length === 1) {
    return <Avatar accountId={accountIds[0]} size={"24px"} />;
  }

  if (accountIds.length === 2) {
    return (
      <div className="d-flex align-items-center">
        <Avatar accountId={accountIds[0]} size={"24px"} />
        <Avatar
          style={{ marginLeft: "-4px" }}
          accountId={accountIds[1]}
          size={"24px"}
        />
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center">
      <Avatar accountId={accountIds[0]} size={"24px"} />
      <Avatar
        style={{ marginLeft: "-4px" }}
        accountId={accountIds[1]}
        size={"24px"}
      />
      <div
        style={{
          marginLeft: "-4px",
          marginTop: "2px",
          height: "24px",
          width: "24px",
          border: "1px solid var(--stroke-color, rgba(255, 255, 255, 0.2))",
          backgroundColor: "var(--bg-2, #23242b)",
          borderRadius: "100%",
          fontSize: "10px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        +{accountIds.length - 2}
      </div>
    </div>
  );
};

return { ProfileImages };
