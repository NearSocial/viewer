import React, { useState } from "react";
import { CommitButton } from "near-social-vm";
import Modal from "react-bootstrap/Modal";

export const SaveDraftModal = (props) => {
  const [commitMessage, setCommitMessage] = useState("");

  const code = props.code;
  const widgetPath = props.widgetPath + "/branch/draft";
  const show = props.show;
  const onHide = props.onHide;
  const near = props.near;
  const metadata = props.metadata

  const onCancel = (e) => {
    e.preventDefault();
    setCommitMessage("");
    onHide();
  };

  return (
    <Modal centered scrollable show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Save to Version History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="text-secondary mb-4">
            Save and commit your changes to the on-chain version history. Give
            your version a description what changed. Then save to the on-chain
            version history.
          </div>
          <label htmlFor="rename-input" className="form-label text-secondary">
            Describe what changed
          </label>
          <input
            className="form-control"
            id="widget-src-input"
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <CommitButton
          className="btn btn-primary"
          near={near}
          onCommit={() => onHide()}
          data={{
            post: {
              commit: {
                text: commitMessage,
                type: "md",
                keys: [widgetPath],
              },
            },
            widget: {
              [props.widgetName]: {
                branch: {
                  draft: {
                    "": code,
                    metadata,
                  },
                },
              },
            },
          }}
        >
          Save
        </CommitButton>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};
