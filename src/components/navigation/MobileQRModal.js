import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useAccount } from "near-social-vm";
import { QRCodeSVG } from "qrcode.react";
import { NetworkId } from "../../data/widgets";
import * as nearAPI from "near-api-js";

export default function MobileQRModal(props) {
  const account = useAccount();
  const onHide = props.onHide;
  const show = props.show;

  const [url, setUrl] = useState("");

  useEffect(() => {
    (async () => {
      const domain = new URL(window.location.href).origin;
      const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
      const keyPair = await keyStore.getKey(NetworkId, account.accountId);
      return `${domain}/signin#?a=${account.accountId}&k=${keyPair.toString()}`;
    })().then(setUrl);
  }, [account]);

  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Scan QR to sign in on another device</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="w-100">
          <QRCodeSVG value={url} size="100%" />
        </div>
        <div>
          <small className="text-muted">
            Don't share this QR with other people. It's only for you.
          </small>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}
