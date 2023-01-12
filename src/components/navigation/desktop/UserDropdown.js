import React, { useCallback } from "react";
import { Widget } from "../../Widget/Widget";
import styled from "styled-components";
import { User } from "../../icons/User";
import { LogOut } from "../../icons/LogOut";
import { Withdraw } from "../../icons/Withdraw";
import { NavLink } from "react-router-dom";
import { TGas, useNear } from "../../../data/near";

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
        path {
          stroke: var(--slate-dark-9);
        }
      }
    }
  }
`;

export function UserDropdown(props) {
  const near = useNear();

  const withdrawStorage = useCallback(async () => {
    await near.contract.storage_withdraw({}, TGas.mul(30).toFixed(0), "1");
  }, [near]);

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
          src={props.NearConfig.widgets.profileImage}
          props={{
            accountId: props.signedAccountId,
            className: "d-inline-block",
            style: { width: "40px", height: "40px" },
          }}
        />
        <div className="profile-info">
          <div className="profile-name">
            <Widget src={props.NearConfig.widgets.profileName} />
          </div>
          <div className="profile-username">{props.signedAccountId}</div>
        </div>
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenu2222">
        <li>
          <NavLink
            className="dropdown-item"
            type="button"
            to={`${props.NearConfig.widgets.profilePage}?accountId=${props.signedAccountId}`}
          >
            <User />
            My Profile
          </NavLink>
        </li>
        <li>
          <button
            className="dropdown-item"
            type="button"
            onClick={() => withdrawStorage()}
          >
            <Withdraw />
            Withdraw {props.availableStorage.div(1000).toFixed(2)}kb
          </button>
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
}
