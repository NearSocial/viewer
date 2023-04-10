import React from "react";
import { GrayBorderButton } from "../../common/buttons/GrayBorderButton";

export function SignInButton(props) {
  return (
    <GrayBorderButton className="nav-sign-in-btn" onClick={props.onSignIn}>
      {props.children}
    </GrayBorderButton>
  );
}
