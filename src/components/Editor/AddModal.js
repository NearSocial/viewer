import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

export default function OpenModal({ onHide, onOpen, onNew, show }) {
  const [widgetSrc, setWidgetSrc] = useState("");

  return (
    <Modal centered scrollable show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add a Component</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-secondary mb-4">
          Open existing components, or create your own.
        </div>
        <div>
          <button
            className="btn btn-outline-success w-100 mb-3"
            onClick={(e) => {
              e.preventDefault();
              onOpen(widgetSrc);
              onHide();
            }}
          >
            Open Component
          </button>
        </div>
        <div className="w-100 text-center text-secondary mb-3">or</div>
        <div>
          <button
            className="btn btn-success w-100 mb-4"
            onClick={(e) => {
              e.preventDefault();
              onNew(widgetSrc);
              onHide();
            }}
          >
            Create New Component
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
