import React, { useCallback, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Markdown } from "./Markdown";
import { Loading } from "../data/utils";

const jsonMarkdown = (data) => {
  const json = JSON.stringify(data, null, 2);
  return `\`\`\`json
${json}
\`\`\``;
};

export default function ConfirmTransaction(props) {
  const [loading, setLoading] = useState(false);

  const onHide = props.onHide;
  const transaction = props.transaction;
  const show = !!transaction;
  const near = props.near;

  const onConfirm = useCallback(async () => {
    const res = await near.functionCall(
      transaction.contractName,
      transaction.methodName,
      transaction.args,
      transaction.gas,
      transaction.deposit
    );
    console.log(res);
    return res;
  }, [near, transaction]);

  return (
    <Modal size="xl" centered scrollable show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {transaction && (
          <div>
            <div>
              <span className="text-secondary">Contract ID: </span>
              <span className="font-monospace">{transaction.contractName}</span>
            </div>
            <div>
              <span className="text-secondary">Method name: </span>
              <span className="font-monospace">{transaction.methodName}</span>
            </div>
            <Markdown text={jsonMarkdown(transaction.args)} />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-success"
          disabled={loading}
          onClick={(e) => {
            e.preventDefault();
            setLoading(true);
            onConfirm().then(() => {
              setLoading(false);
              onHide();
            });
          }}
        >
          {loading && Loading} Confirm
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
}
