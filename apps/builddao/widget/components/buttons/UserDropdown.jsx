const StyledDropdown = styled.div`
  button,
  a {
    font-weight: var(--font-weight-medium);
  }
  .dropdown-toggle {
    display: flex;
    align-items: center;
    text-align: left;
    background-color: var(--slate-dark-5);
    border-radius: 50px;
    outline: none;
    border: 0;

    &:after {
      margin: 0 15px;
      border-top-color: var(--slate-dark-11);
    }

    img {
      border-radius: 50% !important;
    }

    .profile-info {
      margin: 5px 10px;
      line-height: normal;
      max-width: 140px;

      .profile-name,
      .profile-username {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .profile-name {
        color: var(--slate-dark-12);
      }
      .profile-username {
        color: var(--slate-dark-11);
      }
    }
  }

  ul {
    background-color: var(--slate-dark-5);
    width: 100%;
    width: 240px;

    li {
      padding: 0 6px;
    }

    button,
    a {
      color: var(--slate-dark-11);
      display: flex;
      align-items: center;
      border-radius: 8px;
      padding: 12px;

      :hover,
      :focus {
        text-decoration: none;
        background-color: var(--slate-dark-1);
        color: white;

        svg {
          path {
            stroke: white;
          }
        }
      }

      svg {
        margin-right: 7px;
        min-width: 24px;
        path {
          stroke: var(--slate-dark-9);
        }
      }
    }
  }
`;

function User() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.25 8C15.25 9.79493 13.7949 11.25 12 11.25C10.2051 11.25 8.75 9.79493 8.75 8C8.75 6.20507 10.2051 4.75 12 4.75C13.7949 4.75 15.25 6.20507 15.25 8Z"
        stroke="#697177"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.84751 19.25H17.1525C18.2944 19.25 19.174 18.2681 18.6408 17.2584C17.8563 15.7731 16.068 14 12 14C7.93201 14 6.14367 15.7731 5.35924 17.2584C4.82597 18.2681 5.70559 19.25 6.84751 19.25Z"
        stroke="#697177"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogOut() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.75 8.75L19.25 12L15.75 15.25"
        stroke="#697177"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 12H10.75"
        stroke="#697177"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.25 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H15.25"
        stroke="#697177"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

console.log("props", props);

return (
  <StyledDropdown className="dropdown">
    <button
      className="dropdown-toggle"
      type="button"
      id="dropdownMenu2222"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <Widget
        src={"mob.near/widget/ProfileImage"}
        props={{
          accountId: context.accountId,
          className: "d-inline-block",
          style: { width: "40px", height: "40px" },
        }}
      />
      <div className="profile-info">
        <div className="profile-name">
          <Widget src={"patrick.near/widget/ProfileName"} />
        </div>

        <div className="profile-username">{context.accountId}</div>
      </div>
    </button>
    <ul
      className="dropdown-menu"
      aria-labelledby="dropdownMenu2222"
      style={{ minWidth: "fit-content" }}
    >
      <li>
        <Link
          className="dropdown-item"
          type="button"
          to={`/mob.near/widget/ProfilePage?accountId=${context.accountId}`}
        >
          <User />
          My Profile
        </Link>
      </li>
      <li>
        <button
          className="dropdown-item"
          type="button"
          onClick={() => props.logOut()}
        >
          <LogOut />
          Sign Out
        </button>
      </li>
    </ul>
  </StyledDropdown>
);
