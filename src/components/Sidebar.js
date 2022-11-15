import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/near_social_icon.svg";
import { NearConfig, TGas, useAccountId, useNear } from "../data/near";
import { Widget } from "./Widget/Widget";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { cachedViewCall, socialGet } from "../data/cache";
import { Loading } from "../data/utils";

async function fetchApps(near, onInvalidate) {
  const taggedWidgets = await cachedViewCall(
    near,
    NearConfig.contractName,
    "keys",
    {
      keys: ["*/widget/*/metadata/tags/app"],
    },
    "final",
    onInvalidate
  );

  const keys = Object.entries(taggedWidgets)
    .map((kv) => Object.keys(kv[1].widget).map((w) => `${kv[0]}/widget/${w}`))
    .flat();

  if (!keys.length) {
    return [];
  }

  const widgetKeys = await cachedViewCall(
    near,
    NearConfig.contractName,
    "keys",
    {
      keys,
      options: {
        return_type: "BlockHeight",
      },
    },
    "final",
    onInvalidate
  );

  const allMetadata = await cachedViewCall(
    near,
    NearConfig.contractName,
    "get",
    {
      keys: keys.map((k) => `${k}/metadata/**`),
    },
    "final",
    onInvalidate
  );

  const accounts = Object.entries(widgetKeys);

  const allItems = accounts
    .map((account) => {
      const accountId = account[0];
      const accountsMetadata = allMetadata[accountId]?.widget;
      return Object.entries(account[1].widget).map((kv) => {
        const widgetName = kv[0];
        const metadata = accountsMetadata[widgetName]?.metadata;
        return {
          accountId,
          widgetName,
          blockHeight: kv[1],
          metadata,
        };
      });
    })
    .flat();

  allItems.sort((a, b) => b.blockHeight - a.blockHeight);
  return allItems;
}

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

  const [apps, setApps] = useState(null);

  useEffect(() => {
    if (!near) {
      return;
    }
    fetchApps(near).then(setApps);
  }, [near]);

  return (
    <div className="min-vh-100 vh-100">
      <div
        className="position-fixed h-100"
        style={{ width: "4rem", zIndex: 1000 }}
      >
        <div className="h-100 d-flex flex-column flex-shrink-0 bg-light">
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

          <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
            {apps ? (
              apps.map((app) => {
                const widgetSrc = `${app.accountId}/widget/${app.widgetName}`;
                return (
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip>{app.metadata?.name || app.widgetName}</Tooltip>
                    }
                    key={widgetSrc}
                  >
                    <li className="nav-item">
                      <Link
                        to={`/${widgetSrc}`}
                        className="nav-link py-3 border-bottom" // todo active
                        aria-current="page"
                        title="Home"
                        style={{ borderRadius: 0 }}
                      >
                        <div
                          className="d-inline-block"
                          style={{ width: "2em", height: "2em" }}
                        >
                          <Widget
                            src={NearConfig.widgets.image}
                            props={{
                              image: app.metadata?.image,
                              className: "w-100 h-100 shadow",
                              style: {
                                objectFit: "cover",
                                borderRadius: "0.4em",
                              },
                              thumbnail: false,
                              fallbackUrl:
                                "https://ipfs.near.social/ipfs/bafkreido7gsk4dlb63z3s5yirkkgrjs2nmyar5bxyet66chakt2h5jve6e",
                              alt: app.widgetName,
                            }}
                          />
                        </div>
                      </Link>
                    </li>
                  </OverlayTrigger>
                );
              })
            ) : (
              <li className="nav-item">{Loading}</li>
            )}
          </ul>
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
      <div style={{ marginLeft: "4.5rem" }}>{props.children}</div>
    </div>
  );
}
