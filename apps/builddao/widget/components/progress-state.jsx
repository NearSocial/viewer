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
        return "rgba(255, 189, 52, 0.15)";
      case "error":
        return "rgba(253, 42, 92, 0.15)";
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
  return <Progress status={status}>{children}</Progress>;
}

return { ProgressState };
