const { ProgressState } =
  VM.require("buildhub.near/widget/components.ProgressState") || (() => <></>);

const StepContainer = styled.div`
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #000; /* Change color as needed */
    background-image: repeating-linear-gradient(
      90deg,
      #3c3d43,
      #3c3d43 2px,
      transparent 2px,
      transparent 4px
    );
    transform: translateY(-50%);
    z-index: -1;
  }
`;

function Step(props) {
  const totalSteps = props.totalSteps ?? 5;
  const currentStep = props.currentStep ?? 3;
  const currentStatus = props.currentStatus ? props.currentStatus : "focused";

  return (
    <StepContainer
      className="d-flex align-items-center justify-content-between"
      style={{ maxWidth: "360px" }}
      key={`Step-${currentStep}-${currentStatus ?? "default"}`}
    >
      {Array.from({ length: totalSteps }).map((_, i) => (
        <ProgressState
          className="z-1"
          status={
            i + 1 === currentStep
              ? currentStatus
              : currentStep > i + 1
              ? "completed"
              : "default"
          }
        >
          {i + 1}
        </ProgressState>
      ))}
    </StepContainer>
  );
}

return { Step };
