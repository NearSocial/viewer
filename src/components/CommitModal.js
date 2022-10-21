import React, { useCallback, useEffect, useState } from "react";
import { asyncCommit, prepareCommit } from "../data/commitData";
import { displayNear, Loading } from "../data/utils";
import Modal from "react-bootstrap/Modal";
import { Markdown } from "./Markdown";
import { StorageCostPerByte } from "../data/near";

const jsonMarkdown = (data) => {
  const json = JSON.stringify(data, null, 2);
  return `\`\`\`json
${json}
\`\`\``;
};

export const CommitModal = (props) => {
  const show = props.show;
  const onHide = props.onHide;
  const data = props.data;
  const near = props.near;
  const forceRewrite = !!props.forceRewrite;
  const [lastData, setLastData] = useState(null);
  const [commit, setCommit] = useState(null);

  useEffect(() => {
    if (!show) {
      return;
    }
    if (!near.accountId) {
      return;
    }
    if (data === lastData) {
      return;
    }
    setLastData(data);
    setCommit(null);
    prepareCommit(near, data, forceRewrite).then((newCommit) => {
      setCommit(newCommit);
    });
  }, [show, data, lastData, forceRewrite, near]);

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
                <h5>
                  Extra storage deposit{" "}
                  <small className="text-secondary">
                    (can be recovered later)
                  </small>
                </h5>
                <div>
                  {commit.deposit.div(StorageCostPerByte).toFixed(0)} bytes ={" "}
                  {displayNear(commit.deposit)}
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
          disabled={!commit?.data}
          onClick={(e) => {
            e.preventDefault();
            asyncCommit(near, commit.data, commit.deposit).then(onHide);
          }}
        >
          Save Data
        </button>
        <button className="btn btn-secondary" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export const CommitButton = (props) => {
  const vmStack = props.vmStack;
  const data = props.data;
  const near = props.near;
  const children = props.children;
  const originalOnClick = props.onClick;
  const filteredProps = Object.assign({}, props);
  delete filteredProps.vmStack;
  delete filteredProps.data;
  delete filteredProps.near;
  delete filteredProps.onClick;
  delete filteredProps.children;

  const [loading, setLoading] = useState(false);

  return (
    <>
      <button
        {...filteredProps}
        disabled={loading}
        onClick={(e) => {
          e.preventDefault();
          setLoading(true);
          originalOnClick();
        }}
      >
        {loading && Loading}
        {children}
      </button>
      <CommitModal
        data={data}
        near={near}
        show={loading}
        onHide={() => setLoading(false)}
      />
    </>
  );
};
