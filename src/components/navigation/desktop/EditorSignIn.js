import { SignInButton } from "../SignInButton";
import { UserDropdown } from "./UserDropdown";
import React from "react";

export default function EditorSignIn(props) {
  return props.signedIn ? (
    <UserDropdown {...props} />
  ) : (
    <div>
      <SignInButton onSignIn={() => props.requestSignIn()} />
      <p>Sign in with a NEAR account to save (BOS uses the NEAR blockchain underneath)</p>
  </div>
  );
}
