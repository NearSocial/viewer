
const Progress = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  padding: 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 50%;
  border: ${(props) => {
    switch (props.status) {
      case "focused":
        return "1px solid var(--Yellow, #FFAF51)";
      case "error":
        return "1px solid var(--System-Red, #FD2A5C)";
      case "completed":
        return "1px solid var(--Stroke-color, rgba(255, 255, 255, 0.20))";
      default:
        return "1px solid var(--Stroke-color, rgba(255, 255, 255, 0.20))";
    }
  }};

  background: ${(props) => {
    switch (props.status) {
      case "focused":
        return "#2f2619";
      case "error":
        return "#2f101f";
      case "completed":
        return "#FFAF51";
      default:
        return "#23242B";
    }
  }};

  color: ${(props) => {
    switch (props.status) {
      case "focused":
        return "#fff";
      case "error":
        return "#FD2A5C";
      case "completed":
        return "#000";
      default:
        return "#fff";
    }
  }};
`;

function ProgressState({ children, status }) {
  return (
    <Progress
      status={status}
      key={`ProgressState-${status ?? "default"}-${children}`}
    >
      {status === "completed" ? (
        <i className="bi bi-check"></i>
      ) : status === "error" ? (
        <i className="bi bi-x"></i>
      ) : (
        children
      )}
    </Progress>
  );
}

return { ProgressState };