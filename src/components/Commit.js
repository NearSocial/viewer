import React, { useCallback, useEffect, useState } from "react";
import {
  asyncCommit,
  prepareCommit,
  requestPermissionAndCommit,
} from "../data/commitData";
import { displayNear, Loading } from "../data/utils";
import Modal from "react-bootstrap/Modal";
import { Markdown } from "./Markdown";
import { StorageCostPerByte, useAccountId, useNear } from "../data/near";
import { ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useCache } from "../data/cache";

const jsonMarkdown = (data) => {
  const json = JSON.stringify(data, null, 2);
  return `\`\`\`json
${json}
\`\`\``;
};

export const Commit = (props) => {
  const [extraStorage, setExtraStorage] = useState(0);
  const [loading, setLoading] = useState(false);

  const show = props.show;
  const onHide = props.onHide;
  const commit = props.commit;

  return (
    <Modal size="xl" centered scrollable show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Saving data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {commit ? (
          <div>
            <div>
              {commit.data ? (
                <Markdown text={jsonMarkdown(commit.data)} />
              ) : (
                <h5>No new data to save</h5>
              )}
            </div>
            {commit.data && commit?.deposit?.gt(0) && (
              <div>
                <h6>
                  Required storage deposit{" "}
                  <small className="text-secondary">
                    (can be recovered later)
                  </small>
                </h6>
                <div className="mb-2">
                  {commit.deposit.div(StorageCostPerByte).toFixed(0)} bytes ={" "}
                  {displayNear(commit.deposit)}
                </div>
                <h6>
                  Optional storage deposit{" "}
                  <small className="text-secondary">
                    (can be used to avoid future wallet TX confirmation)
                  </small>
                </h6>
                <div>
                  <ToggleButtonGroup
                    type="radio"
                    name="storageDeposit"
                    value={extraStorage}
                    onChange={setExtraStorage}
                    disabled={loading}
                  >
                    <ToggleButton
                      id="esd-0"
                      variant="outline-success"
                      value={0}
                    >
                      No Deposit
                    </ToggleButton>
                    <ToggleButton
                      id="esd-5000"
                      variant="outline-success"
                      value={5000}
                    >
                      0.05 NEAR (5Kb)
                    </ToggleButton>
                    <ToggleButton
                      id="esd-20000"
                      variant="outline-success"
                      value={20000}
                    >
                      0.2 NEAR (20Kb)
                    </ToggleButton>
                    <ToggleButton
                      id="esd-100000"
                      variant="outline-success"
                      value={100000}
                    >
                      1 NEAR (100Kb)
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
              </div>
            )}
          </div>
        ) : (
          Loading
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-success"
          disabled={!commit?.data || loading}
          onClick={(e) => {
            e.preventDefault();
            setLoading(true);
            props.onCommit(extraStorage).then(() => setLoading(false));
          }}
        >
          {loading && Loading} Save Data
        </button>
        <button
          className="btn btn-secondary"
          onClick={onHide}
          disabled={loading}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export const CommitButton = (props) => {
  const near = useNear();
  const accountId = useAccountId();
  const cache = useCache();

  const { data, children, onClick, onCommit, disabled, force, ...rest } = props;

  const [loading, setLoading] = useState(false);

  const [lastData, setLastData] = useState(null);
  const [commit, setCommit] = useState(null);

  useEffect(() => {
    if (!loading) {
      return;
    }
    if (!accountId) {
      return;
    }
    if (JSON.stringify(data ?? null) === JSON.stringify(lastData ?? null)) {
      return;
    }
    setLastData(data);
    setCommit(null);
    prepareCommit(near, data, force).then((newCommit) => {
      setCommit(newCommit);
    });
  }, [loading, data, lastData, force, near, accountId]);

  return (
    <>
      <button
        {...rest}
        disabled={disabled || loading || !near?.accountId}
        onClick={(e) => {
          e.preventDefault();
          setLoading(true);
          if (onClick) {
            onClick();
          }
        }}
      >
        {loading && Loading}
        {children}
      </button>
      <Commit
        show={loading && !!commit}
        commit={commit}
        onHide={() => setLoading(false)}
        onCommit={async (extraStorage) => {
          const deposit = commit.deposit.add(
            StorageCostPerByte.mul(extraStorage)
          );
          if (commit.permissionGranted) {
            await asyncCommit(near, commit.data, deposit);
          } else {
            await requestPermissionAndCommit(near, commit.data, deposit);
          }
          setLoading(false);
          if (onCommit) {
            try {
              onCommit(commit.data);
            } catch (e) {
              console.error(e);
            }
          }
          cache.invalidateCache(commit.data);
        }}
      />
    </>
  );
};
