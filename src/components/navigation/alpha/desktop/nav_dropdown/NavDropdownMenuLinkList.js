import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Apps from "../../icons/apps.svg";
import UserCircle from "../../icons/user-circle.svg";
import Users from "../../icons/users.svg";
import Code from "../../icons/code.svg";
import Education from "../../icons/Education.svg";
import Notebook from "../../icons/Notebook.svg";
import { useAccount } from "near-social-vm";

const StyledDropdownLinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  a {
    display: flex;
    align-items: center;
    border-radius: 6px;
    padding: 12px;

    &:hover {
      text-decoration: none;
      background-color: #2b2f31;
    }
  }

  li {
    &.hide {
      opacity: 0;
      pointer-events: none;
    }
  }

  .nav-dropdown-link-icon {
    margin-right: 12px;
  }

  .nav-dropdown-link-title {
    color: #ecedee;
    font-weight: 600;
  }

  .nav-dropdown-link-description {
    color: #9ba1a6;
  }
`;

export function NavDropdownMenuLinkList(props) {
  const account = useAccount();

  const NavMenuLinkData = [
    {
      title: "Applications",
      description: "Discover and use new applications on NEAR.",
      link: "/mob.near/widget/Applications",
      icon: Apps,
      category: "discover",
    },
    {
      title: "People",
      description: "Connect with friends and follow inspiring creators.",
      link: "/calebjacob.near/widget/People",
      icon: UserCircle,
      category: "discover",
    },
    {
      title: "Groups",
      description: "Find your community and get involved.",
      link: account?.accountId
        ? `/zavodil.near/widget/AllLabels?accountId=${account?.accountId}`
        : "/zavodil.near/widget/AllLabels",
      icon: Users,
      category: "discover",
    },
    {
      title: "Editor",
      description:
        "Build new components and applications with little to no setup.",
      link: "/edit",
      icon: Code,
      category: "tools",
    },
    {
      title: "Documentation",
      description:
        "Build new components and applications with little to no setup.",
      link: "https://thewiki.near.page/near.social_docs",
      icon: Education,
      category: "tools",
    },
    {
      title: "Tutorials",
      description:
        "Build new components and applications with little to no setup.",
      link: "https://thewiki.near.page/near.social_tutorial",
      icon: Notebook,
      category: "tools",
    },
  ];

  return (
    <StyledDropdownLinkList>
      {NavMenuLinkData.filter((link) => link.category === props.category).map(
        (link) => {
          return (
            <li
              key={link.title}
              className={link.title === "Groups" ? "hide" : ""}
            >
              <MenuLink to={link.link} key={link.title} onClick={props.onClick}>
                <img className="nav-dropdown-link-icon" src={link.icon} />
                <div>
                  <div className="nav-dropdown-link-title">{link.title}</div>
                  <div className="nav-dropdown-link-description">
                    {link.description}
                  </div>
                </div>
              </MenuLink>
            </li>
          );
        }
      )}
    </StyledDropdownLinkList>
  );
}

function MenuLink(props) {
  return (
    <>
      {!props.to.startsWith("http") ? (
        <Link onClick={props.onClick} key={props.key} to={props.to}>
          {props.children}
        </Link>
      ) : (
        <a
          onClick={props.onClick}
          key={props.key}
          href={props.to}
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.children}
        </a>
      )}
    </>
  );
}
