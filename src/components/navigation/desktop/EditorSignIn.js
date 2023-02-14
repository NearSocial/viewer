import { SignInButton } from "../SignInButton";
import { UserDropdown } from "./UserDropdown";
import React from "react";

export default function EditorSignIn(props) {
  return props.signedIn ? (
    <UserDropdown {...props} />
  ) : (
    <SignInButton onSignIn={() => props.requestSignIn()} />
  );
}
