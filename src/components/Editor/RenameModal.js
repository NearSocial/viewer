import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

export default function RenameModal(props) {
  const onHide = props.onHide;
  const name = props.name;
  const onRename = props.onRename;
  const show = props.show;

  const [newName, setNewName] = useState(name);

  return (
    <Modal centered scrollable show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Rename</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label htmlFor="rename-input" className="form-label">
          New name
        </label>
        <input
          className="form-control"
          id="rename-input"
          type="text"
          value={newName}
          onChange={(e) =>
            setNewName(e.target.value.replaceAll(/[^a-zA-Z0-9_.\-]/g, ""))
          }
        />
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-success"
          disabled={!newName || newName === name}
          onClick={(e) => {
            e.preventDefault();
            onRename(newName);
            onHide();
          }}
        >
          Confirm
        </button>
        <button className="btn btn-secondary" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
