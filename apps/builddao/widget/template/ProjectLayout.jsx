const { Button } = VM.require("buildhub.near/widget/components") || {
  Button: () => <></>,
};

const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => {},
};

const Container = styled.div`
  display: flex;
  gap: 24px;
  flex-direction: column;
  width: 100%;

  padding: 24px 40px;
`;

const BackgroundImage = styled.div`
  img {
    height: 252px;
  }

  @media screen and (max-width: 768px) {
    img {
      height: 126px;
    }
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  gap: 24px;

  .left {
    img {
      width: 100px;
      height: 100px;
      border-radius: 100px;
    }
  }

  @media screen and (max-width: 768px) {
    .left {
      img {
        width: 64px;
        height: 64px;
      }
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;

    .info {
      display: flex;
      align-items: flex-start;
      gap: 4px;
      flex-direction: column;
      h3 {
        color: var(--white-100, #fff);
        font-size: 24px;
        font-weight: 500;
        margin: 0;
      }

      p {
        color: var(--white-50, #b0b0b0);
        font-size: 16px;
        margin: 0;
      }
    }

    .links {
      color: var(--white-100, #fff);
      font-size: 13px;

      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
`;

const Nav = styled.div`
  .nav-pills {
    background: var(--bg-1, #0b0c14);
    font-weight: 500;
    --bs-nav-pills-border-radius: 0;
    --bs-nav-link-color: var(--font-color, #fff);
    --bs-nav-pills-link-active-color: var(--font-color, #fff);
    --bs-nav-pills-link-active-bg: var(--bg-1, #0b0c14);
    --bs-nav-link-padding-y: 0.75rem;
    border-bottom: 1px solid var(--stroke-color, rgba(255, 255, 255, 0.2));
    padding-top: 3px;
  }
  .nav-link.active {
    border-bottom: 2px solid var(--Yellow, #ffaf51);
  }

  .nav-item:not(:has(> .disabled)):hover {
    background: rgba(13, 110, 253, 0.15);
  }
`;

const ProjectLayout = ({
  accountId,
  profile,
  routes,
  children,
  project,
  id,
}) => {
  const {
    title,
    description,
    tags,
    collaborators,
    projectLink,
    demoLink,
    contactInfo,
    referrer,
    learning,
  } = project;

  const [address, app, type, titleUrl] = id.split("/");

  console.log("params", { app, type, titleUrl });

  if (!accountId) {
    return <p className="fw-bold text-white">No Account ID</p>;
  }

  return (
    <Container>
      <div className="my-3 w-100">
        <Link
          style={{ textDecoration: "none" }}
          to={href({
            widgetSrc: "buildhub.near/widget/app",
            params: {
              page: "projects",
            },
          })}
        >
          <span className="text-white">
            <i className="bi bi-chevron-left"></i> Back to Projects
          </span>
        </Link>
      </div>
      <BackgroundImage>
        {profile.backgroundImage && (
          <Widget
            src="mob.near/widget/Image"
            props={{
              image: profile.backgroundImage,
              alt: "profile background",
              className: "w-100",
              style: { objectFit: "cover", left: 0, top: 0 },
              fallbackUrl:
                "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm",
            }}
          />
        )}
      </BackgroundImage>
      <ProfileInfo>
        <div className="left">
          <Widget
            src="mob.near/widget/Image"
            props={{
              image: profile.image,
              alt: "profile image",
              style: { objectFit: "cover", left: 0, top: 0 },
              fallbackUrl:
                "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm",
            }}
          />
        </div>
        <div className="right">
          <div className="info">
            <h3>{title ?? profile.name}</h3>
            <p>@{accountId}</p>
          </div>

          <div className="links">
            <span>Links</span>
            <Widget
              src="buildhub.near/widget/components.profile.Linktree"
              loading=""
              props={{
                profile,
              }}
            />
          </div>
        </div>
      </ProfileInfo>
      <Nav>
        <ul className="nav nav-pills nav-fill" id="pills-tab" role="tablist">
          {routes &&
            Object.keys(routes).map((it) => (
              <li className="nav-item" role="presentation" key={it}>
                <Link
                  to={href({
                    widgetSrc: `buildhub.near/widget/app`,
                    params: {
                      page: "project",
                      id: `${accountId}/${app}/${type}/${titleUrl}`,
                      tab: it,
                    },
                  })}
                  key={it}
                >
                  <button
                    className={`nav-link ${it === page ? "active" : ""}`}
                    id={`pills-${id}-tab`}
                    data-bs-toggle="pill"
                    data-bs-target={`#pills-${it}`}
                    type="button"
                    role="tab"
                    aria-controls={`pills-${it}`}
                    aria-selected={i === 0}
                  >
                    {it.slice(0, 1).toUpperCase() + it.slice(1)}
                  </button>
                </Link>
              </li>
            ))}
        </ul>
      </Nav>
      <div
        className="tab-content"
        style={{ marginTop: 8 }}
        id="pills-tabContent"
      >
        <div
          className="tab-pane fade show active"
          id="pills-overview"
          role="tabpanel"
          aria-labelledby="pills-overview-tab"
          key={tab}
        >
          {children}
        </div>
      </div>
    </Container>
  );
};

return { ProjectLayout };
