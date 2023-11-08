const [proposalWidget, setProposalWidget] = useState("");

return (
  <>
    <h1>Propose a new page</h1>
    <input
      placeholder="Enter a widget src"
      value={proposalWidget}
      onChange={(e) => setProposalWidget(e.target.value)}
    />
    <a href="#">
      {" "}
      Propose{" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
      >
        <path
          d="M10.7814 7.83327L7.20539 4.25726L8.14819 3.31445L13.3337 8.49993L8.14819 13.6853L7.20539 12.7425L10.7814 9.1666H2.66699V7.83327H10.7814Z"
          fill="black"
        />
      </svg>
    </a>
  </>
);
