import React, { useCallback, useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { useNear } from "../data/near";
import { Markdown } from "./Markdown";

const jsonMarkdown = (data) => {
    const json = JSON.stringify(data, null, 2);
    return `\`\`\`json
${json}
\`\`\``;
};

export default function ConfirmTransaction(props) {
    const near = useNear();
    const [show, setShow] = useState(true);

    const handleCancel = () => props.onCancel();

    const handleConfirm = async () => {
        const res = await near.functionCall(
            props.contractName,
            props.methodName,
            props.args,
            props.gas,
            props.deposit
        );
        console.log(res);
        return res;
    }

    return <Modal show={show} onHide={handleCancel}>
        <Modal.Header closeButton>
            <Modal.Title>Confirm Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
                {props.contractName}.{props.methodName}
                <Markdown text={jsonMarkdown(props.args)} />
            </div>
        </Modal.Body>
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