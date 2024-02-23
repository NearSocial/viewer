const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    class="bi bi-twitter-x"
    viewBox="0 0 16 16"
  >
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
  </svg>
);

const profile = props.profile;

return (
  <div className="d-flex align-items-center flex-wrap" style={{ gap: 10 }}>
    {profile.linktree.twitter && (
      <a
        href={`https://x.com/${profile.linktree.twitter}`}
        target="_blank"
        style={{ textDecoration: "none" }}
      >
        <Button variant="outline" type="icon" style={{ fontSize: 16 }}>
          <TwitterIcon />
        </Button>
      </a>
    )}
    {profile.linktree.github && (
      <a
        href={`https://github.com/${profile.linktree.github}`}
        target="_blank"
        style={{ textDecoration: "none" }}
      >
        <Button variant="outline" type="icon" style={{ fontSize: 16 }}>
          <i className="bi bi-github"></i>
        </Button>
      </a>
    )}
    {profile.linktree.telegram && (
      <a
        href={`https://t.me/${profile.linktree.telegram}`}
        target="_blank"
        style={{ textDecoration: "none" }}
      >
        <Button variant="outline" type="icon" style={{ fontSize: 16 }}>
          <i className="bi bi-telegram"></i>
        </Button>
      </a>
    )}
    {profile.linktree.website && (
      <a
        href={`https://${profile.linktree.website}`}
        target="_blank"
        style={{ textDecoration: "none" }}
      >
        <Button variant="outline" type="icon" style={{ fontSize: 16 }}>
          <i className="bi bi-globe"></i>
        </Button>
      </a>
    )}
    {profile.linktree.youtube && (
      <a
        href={`https://youtube.com/${profile.linktree.youtube}`}
        target="_blank"
        style={{ textDecoration: "none" }}
      >
        <Button variant="outline" type="icon" style={{ fontSize: 16 }}>
          <i className="bi bi-youtube"></i>
        </Button>
      </a>
    )}
  </div>
);
