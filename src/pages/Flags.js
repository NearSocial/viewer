import styled from "styled-components";

import { useClearCurrentComponent } from "../hooks/useClearCurrentComponent";
import { useFlags } from "../hooks/useFlags";
import React, { useState } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 1rem;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export default function Flags() {
  const [flags, setFlags] = useFlags();
  const [url, setUrl] = useState(flags?.bosLoaderUrl || "");

  useClearCurrentComponent();

  return (
    <Container className="container-xl">
      <h1>
        Flags
      </h1>

      <Form>
        <InputGrid>
          <p>
            BOS Loader Url
          </p>

          <input
            className="form-control"
            placeholder="e.g. http://127.0.0.1:3030/, https://my-loader.ngrok.io"
            id="bosLoaderUrl"
            onChange={(e) => setUrl(e.target.value)}
          />
        </InputGrid>

        <button
          onClick={() => setFlags({ bosLoaderUrl: url })}
          style={{ marginLeft: "auto" }}
        >Save</button>
      </Form>
    </Container>
  );
};

{/* <Widget
src="devs.near/widget/SetFlagButton"
props={{
  url: "https://everything.dev",
  setFlags: setFlags,
}}
/> */}