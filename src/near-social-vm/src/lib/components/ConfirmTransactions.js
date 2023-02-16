import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Markdown } from "./Markdown";
import { displayGas, displayNear, Loading } from "../data/utils";
import { useNear } from "../data/near";
import uuid from "react-uuid";

const jsonMarkdown = (data) => {
  const json = JSON.stringify(data, null, 2);
  return `\`\`\`json
${json}
\`\`\``;
};

export default function ConfirmTransactions(props) {
  const gkey = useState(uuid());
  const near = useNear();
  const [loading, setLoading] = useState(false);

  const onHide = props.onHide;
  const transactions = props.transactions;
  const show = !!transactions;

  return (
    <Modal size="xl" centered scrollable show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {transactions &&
          transactions.map((transaction, i) => (
            <div key={`${gkey}-${i}`}>
              <div>
                <h4>Transaction #{i + 1}</h4>
              </div>
              <div>
                <span className="text-secondary">Contract ID: </span>
                <span className="font-monospace">
                  {transaction.contractName}
                </span>
              </div>
              <div>
                <span className="text-secondary">Method name: </span>
                <span className="font-monospace">{transaction.methodName}</span>
              </div>
              {transaction.deposit && transaction.deposit.gt(0) && (
                <div>
                  <span className="text-secondary">Deposit: </span>
                  <span className="font-monospace">
                    {displayNear(transaction.deposit)}
                  </span>
                </div>
              )}
              <div>
                <span className="text-secondary">Gas: </span>
                <span className="font-monospace">
                  {displayGas(transaction.gas)}
                </span>
              </div>
              <Markdown text={jsonMarkdown(transaction.args)} />
            </div>
          ))}
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-success"
          disabled={loading}
          onClick={(e) => {
            e.preventDefault();
            setLoading(true);
            near.sendTransactions(transactions).then(() => {
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
