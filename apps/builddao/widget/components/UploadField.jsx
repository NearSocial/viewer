const { Button } =
  VM.require("buildhub.near/widget/components.Button") || (() => <></>);

const UploadContainer = styled.div`
  display: flex;
  max-width: 390px;
  min-height: 200px;
  width: 100%;
  height: 100%;
  padding: 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;

  border-radius: 16px;
  border: 1px dashed var(--stroke-color, rgba(255, 255, 255, 0.2));
  background: ${(props) =>
    props.background ? "var(--bg-2, #23242B)" : "var(--bg-1, #0b0c14)"};

  p {
    color: var(--font-color, #fff);
    text-align: center;

    /* Body/Medium-16px */
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin: 0;
  }

  p.secondary {
    color: var(--font-muted-color, #cdd0d5);
    text-align: center;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 133.333% */
  }

  i {
    color: var(--font-color, #fff);
    font-size: 2rem;
  }
`;

function UploadField({ background }) {
  return (
    <UploadContainer background={background}>
      <i class="bi bi-cloud-upload"></i>
      <div className="d-flex flex-column gap-2">
        <p>Choose a file or drag & drop it here.</p>
        <p className="secondary">
          JPEG, PNG, PDF, and MP4 formats, up to 50 MB.
        </p>
      </div>
      <Button
        variant="outline"
        style={{ background: background && "var(--bg-2,#23242B)" }}
      >
        Browse Files
      </Button>
    </UploadContainer>
  );
}

return { UploadField };
