import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/near_social_icon.svg";
import { NearConfig, TGas, useAccountId, useNear } from "../data/near";
import { Widget } from "./Widget/Widget";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export function Sidebar(props) {
  const near = useNear();
  const accountId = useAccountId();
  const widgetSrc = props.widgetSrc;

  const withdrawStorage = useCallback(
    async (e) => {
      e && e.preventDefault();
      await near.contract.storage_withdraw({}, TGas.mul(30).toFixed(0), "1");
      return false;
    },
    [near]
  );

  return (
    <>
      <div
        className="navbar p-0 bg-light fixed-top w-100 border-bottom"
        style={{ height: "4em", zIndex: 1100 }}
      >
        <div className="w-100 sidebar-items d-flex flex-row">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Near Social</Tooltip>}
          >
            <div>
              <Link className="d-block link-dark" to="/">
                <img
                  src={Logo}
                  alt="Near Social logo horizontal"
                  className="d-inline-block"
                  style={{ height: "1.5rem" }}
                />
              </Link>{" "}
            </div>
          </OverlayTrigger>

          <div className="apps flex-grow-1 flex-shrink-1 overflow-hidden flex-row sidebar-items">
            {NearConfig.widgets.navigationApps && (
              <Widget src={NearConfig.widgets.navigationApps} />
            )}
          </div>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Notifications</Tooltip>}
          >
            <div>
              <Widget src={NearConfig.widgets.notificationButton} />
            </div>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Widget</Tooltip>}
          >
            <div className="nav-item">
              <div className="dropdown d-flex align-items-center justify-content-center ">
                <a
                  href="#"
                  className="link-dark text-decoration-none dropdown-toggle"
                  id="dropdownWidgets"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-gear-fill fs-4"></i>
                </a>

                <ul
                  className="dropdown-menu shadow dropdown-menu-end"
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
            </div>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Account</Tooltip>}
          >
            <div className="border-0">
              <div className="dropdown">
                <a
                  href="#"
                  className="d-flex align-items-center justify-content-center link-dark text-decoration-none dropdown-toggle"
                  id="dropdownUser"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
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

                <ul
                  className="dropdown-menu dropdown-menu-end shadow"
                  aria-labelledby="dropdownUser"
                >
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
          </OverlayTrigger>
        </div>
      </div>
      <div style={{ paddingTop: "4.5em" }}>{props.children}</div>
    </>
  );
}
