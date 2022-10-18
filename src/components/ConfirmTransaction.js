import React, { useCallback, useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { useNear } from "../data/near";

export default function ConfirmTransaction(props) {
    const near = useNear();
    const [show, setShow] = useState(true);

    const handleCancel = () => setShow(false);

    const handleConfirm = () => {
        return near.functionCall(
            props.contractName,
            props.methodName,
            props.args,
            props.gas,
            props.deposit
        );
    }

    return <Modal show={show} onHide={handleCancel}>
        <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
            <button variant="secondary" onClick={handleCancel}>
                Close
            </button>
            <button variant="primary" onClick={handleConfirm}>
                Confirm
            </button>
        </Modal.Footer>
    </Modal>
}