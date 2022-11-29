import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/near_social_icon.svg";
import LogoHorizontal from "../images/near_social_combo.svg";
import { NearConfig, TGas, useAccountId, useNear } from "../data/near";
import { Widget } from "./Widget/Widget";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export function Sidebar(props) {
  const near = useNear();
  const accountId = useAccountId();
  const widgetSrc = props.widgetSrc;
  const [show, setShow] = useState(false);

  const withdrawStorage = useCallback(
    async (e) => {
      e && e.preventDefault();
      await near.contract.storage_withdraw({}, TGas.mul(30).toFixed(0), "1");
      return false;
    },
    [near]
  );

  return (
    <div className="min-vh-100 vh-100">
      <div id="sidebar" className={show ? "show" : ""}>
        <div className="h-100 d-flex flex-column bg-light">
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Near Social</Tooltip>}
          >
            <Link
              className="d-block py-3 text-center link-dark text-decoration-none border-bottom"
              to="/"
            >
              <img
                src={Logo}
                alt="Near Social logo horizontal"
                className="d-inline-block"
                style={{ height: "1.5rem" }}
              />
            </Link>
          </OverlayTrigger>

          <div className="flex-grow-1 flex-shrink-1 overflow-hidden">
            {NearConfig.widgets.navigationApps && (
              <Widget src={NearConfig.widgets.navigationApps} />
            )}
          </div>
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Notifications</Tooltip>}
          >
            <div className="d-block py-1 text-center link-dark text-decoration-none border-top">
              <Widget src={NearConfig.widgets.notificationButton} />
            </div>
          </OverlayTrigger>
          <div className="dropend border-top">
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Widget</Tooltip>}
            >
              <a
                href="#"
                className="d-flex align-items-center justify-content-center p-2 link-dark text-decoration-none dropdown-toggle"
                id="dropdownWidgets"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-gear-fill fs-4"></i>
              </a>
            </OverlayTrigger>
            <ul
              className="dropdown-menu shadow"
              aria-labelledby="dropdownWidgets"
            >
              <li>
                <Link className="dropdown-item" to="/edit/new">
                  New widget
                </Link>
              </li>
              {widgetSrc?.edit && (
                <li>
                  <Link
                    className="dropdown-item"
                    to={`/edit/${widgetSrc.edit}`}
                  >
                    {widgetSrc.edit.startsWith(
                      `${props.signedAccountId}/widget/`
                    )
                      ? "Edit widget"
                      : "Fork widget"}
                  </Link>
                </li>
              )}
              {widgetSrc?.view && (
                <li>
                  <Link
                    className="dropdown-item"
                    to={`/${NearConfig.widgets.viewSource}?src=${widgetSrc?.view}`}
                  >
                    View source
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className="dropend border-top">
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Account</Tooltip>}
            >
              <a
                href="#"
                className="d-flex align-items-center justify-content-center px-2 link-dark text-decoration-none dropdown-toggle"
                id="dropdownUser"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ paddingTop: "0.666rem", paddingBottom: "0.666rem" }}
              >
                <div
                  className="d-inline-block"
                  style={{ width: "2em", height: "2em" }}
                >
                  <Widget
                    src={NearConfig.widgets.profileImage}
                    props={{
                      accountId,
                      className: "d-inline-block",
                      style: { width: "2em", height: "2em" },
                    }}
                  />
                </div>
              </a>
            </OverlayTrigger>
            <ul className="dropdown-menu shadow" aria-labelledby="dropdownUser">
              {props.signedIn ? (
                <>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={(e) => withdrawStorage(e)}
                      title={`Withdraw all available storage`}
                    >
                      Withdraw{" "}
                      {props.availableStorage &&
                        props.availableStorage.div(1000).toFixed(2)}
                      kb
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={(e) => props.logOut(e)}
                    >
                      Sign out {props.signedAccountId}
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    className="dropdown-item"
                    onClick={(e) => props.requestSignIn(e)}
                  >
                    Sign in with NEAR Wallet
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="navbar fixed-top d-sm-none bg-light w-100 pb-2">
        <div className="container-fluid">
          <button className="navbar-toggler" onClick={() => setShow(!show)}>
            <span className="navbar-toggler-icon" />
          </button>
          <Link className="navbar-brand" to="/" title="Near Social">
            <img
              src={LogoHorizontal}
              alt="Near Social logo horizontal"
              height="24"
              className="d-inline-block align-text-top me-2"
            />
          </Link>
        </div>
      </div>
      <div id="content" className={show ? "show" : ""}>
        {props.children}
      </div>
    </div>
  );
}
