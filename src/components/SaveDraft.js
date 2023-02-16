import React, { useState } from "react";
import { CommitButton } from "./Commit";
import Modal from "react-bootstrap/Modal";

export const SaveDraftModal = (props) => {
    const [commitMessage, setCommitMessage] = useState("");
   
    const code = props.code;
    const widgetPath = props.widgetPath + "/branch/draft";
    const show = props.show;
    const onHide = props.onHide;
    const near = props.near;
    
    const onCancel = (e) => {
      e.preventDefault();
      setCommitMessage("");
      onHide();
    };
  
    return (
      <Modal size="xl" centered scrollable show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Saving draft</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
              <h5>Optional commit message for your draft:</h5>
              <input
                className="form-control"
                id="widget-src-input"
                type="text"
                value={commitMessage}
                onChange={(e) =>
                  setCommitMessage(e.target.value)
                }
              />
            </div>
        </Modal.Body>
        <Modal.Footer>
        <CommitButton
          className="btn btn-primary"
          near={near}
          data={{
            post:{
              commit: {
                text: commitMessage,
                type: "md",
                keys: [widgetPath]
              }
            },
            widget: {
              [props.widgetName]: {
                branch: {
                  draft: {
                    "": code
                  }
                }
              },
            },
          }}
        >
          Save Draft
        </CommitButton>
          <button
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    );
};