const { Button, Hashtag } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
  Hashtag: () => <></>,
};

if (!context.accountId || !props.accountId) {
  return "No Account ID";
}

const accountId = props.accountId || context.accountId;

const profile = Social.getr(`${accountId}/profile`);
if (!profile) {
  return "";
}

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M4.66653 3.99999V1.99999C4.66653 1.63181 4.96501 1.33333 5.3332 1.33333H13.3332C13.7014 1.33333 13.9999 1.63181 13.9999 1.99999V11.3333C13.9999 11.7015 13.7014 12 13.3332 12H11.3332V13.9994C11.3332 14.3679 11.0333 14.6667 10.662 14.6667H2.67111C2.30039 14.6667 2 14.3703 2 13.9994L2.00173 4.66724C2.0018 4.29873 2.30176 3.99999 2.67295 3.99999H4.66653ZM3.33495 5.33333L3.33346 13.3333H9.99987V5.33333H3.33495ZM5.99987 3.99999H11.3332V10.6667H12.6665V2.66666H5.99987V3.99999Z"
      fill="white"
    />
  </svg>
);

const Container = styled.div`
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .profile-image-section {
    display: flex;
    align-items: center;
    justify-content: space-between;

    img {
      width: 4rem !important;
      height: 4rem !important;
      border-radius: 100%;
      image-rendering: pixelated;
      object-fit: cover;
    }
  }

  .account-info-section {
    h3 {
      color: var(--White-100, #fff);
      /* H3/Large */
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      line-height: 140%; /* 33.6px */
      margin: 0;
    }

    span {
      display: flex;
      align-items: center;
      gap: 4px;
      max-width: max-content;

      color: var(--White-50, #b0b0b0);

      /* Body/14px */
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 170%; /* 23.8px */
      margin: 0;

      cursor: pointer;
    }
  }

  .bio-section {
    display: flex;
    flex-direction: column;
    gap: 8px;

    h3 {
      color: var(--White-100, #fff);
      /* Body/10px */
      font-size: 10px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin: 0;
    }

    p {
      color: var(--White-50, #b0b0b0);

      /* Body/14px */
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 170%; /* 23.8px */
      margin: 0;
    }
  }

  .link-section {
    display: flex;
    flex-direction: column;
    gap: 8px;

    h3 {
      color: var(--White-100, #fff);
      /* Body/10px */
      font-size: 10px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin: 0;
    }
  }
  .badge-section {
    display: flex;
    flex-direction: column;
    gap: 8px;

    h3 {
      color: var(--White-100, #fff);
      /* Body/10px */
      font-size: 10px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin: 0;
    }
  }

  .location-section {
    span {
      display: flex;
      align-items: center;
      gap: 4px;

      color: var(--White-50, #b0b0b0);

      /* Body/14px */
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 170%; /* 23.8px */
    }
  }
`;

const MapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g clip-path="url(#clip0_777_6945)">
      <path
        d="M7.33335 11.9587C4.70248 11.6306 2.66669 9.38638 2.66669 6.66665C2.66669 3.72113 5.0545 1.33331 8.00002 1.33331C10.9456 1.33331 13.3334 3.72113 13.3334 6.66665C13.3334 9.38638 11.2976 11.6306 8.66669 11.9587V14H7.33335V11.9587ZM8.00002 10.6666C10.2092 10.6666 12 8.87578 12 6.66665C12 4.45751 10.2092 2.66665 8.00002 2.66665C5.79088 2.66665 4.00002 4.45751 4.00002 6.66665C4.00002 8.87578 5.79088 10.6666 8.00002 10.6666ZM3.33335 14.6666H12.6667V16H3.33335V14.6666Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_777_6945">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const Badges = ({ tags }) => {
  if (!tags) {
    return null;
  }

  tags = Object.keys(tags);

  return (
    <>
      <h3>BADGE</h3>
      <div className="d-flex flex-align-center flex-wrap" style={{ gap: 12 }}>
        {tags.map((it) => (
          <Hashtag key={it}>{it}</Hashtag>
        ))}
      </div>
    </>
  );
};

const [editMode, setEditMode] = useState(false);

const InfoSection = () => {
  return (
    <>
      <div className="profile-image-section">
        <Widget
          src="mob.near/widget/Image"
          loading=""
          props={{ image: profile.image }}
        />

        {context.accountId === accountId && (
          <Button variant="outline" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        )}
      </div>
      <div className="account-info-section">
        <h3>{profile.name}</h3>
        <span onClick={() => clipboard.writeText(accountId)}>
          {accountId} <CopyIcon />
        </span>
      </div>
      <div>
        <Widget
          src="buildhub.near/widget/components.profile.FollowStats"
          loading=""
          props={{ accountId }}
        />
      </div>
      <div className="badge-section">
        <Badges tags={profile.tags} />
      </div>
      {profile.description && (
        <div className="bio-section">
          <h3>BIO</h3>
          <Markdown text={profile.description} />
        </div>
      )}
      {profile.location && (
        <div className="location-section">
          <span>
            <MapIcon /> {profile.location}
          </span>
        </div>
      )}
      <div className="link-section">
        <h3>LINKS</h3>
        {profile.linktree && (
          <div className="link-section">
            <Widget
              src="buildhub.near/widget/components.profile.Linktree"
              props={{
                profile,
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

const EditSection = () => {
  return (
    <Widget
      src="buildhub.near/widget/components.profile.ProfileEdit"
      loading=""
      props={{ setEditMode }}
    />
  );
};

return <Container>{!editMode ? <InfoSection /> : <EditSection />}</Container>;
