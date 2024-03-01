const [view, setView] = useState("selection");
const [selection, setSelection] = useState(0);

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  background: #000000;
  color: #fff;
`;

const Card = styled.div`
  display: flex;
  padding: 80px 24px;
  max-width: 500px;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  h1 {
    color: var(--white-100, #fff);
    text-align: center;

    /* H1/small */
    font-size: 32px;
    font-style: normal;
    font-weight: 500;
    line-height: 100%; /* 32px */
  }

  span.disabled {
    cursor: not-allowed !important;
  }

  input {
    border-radius: 4px;
    border: 1px solid var(--Stroke-color, rgba(255, 255, 255, 0.2));

    padding: 12px;

    color: var(--white-50, rgba(255, 255, 255, 0.7));
    /* Body/Small */
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 170%; /* 23.8px */

    background-color: #000000;
  }

  .form-control:focus {
    color: var(--white-50, rgba(255, 255, 255, 0.7));
    background-color: #000000;
  }

  input::placeholder {
    color: var(--white-50, rgba(255, 255, 255, 0.7));
    /* Body/Small */
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 170%; /* 23.8px */
  }

  a {
    display: flex;
    padding: 10px 20px;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border-radius: 8px;
    background: var(--Yellow, #eca227);

    color: var(--black-100, #000) !important;

    ${selection === 0 && "pointer-events: none;"}

    /* Other/Button_text */
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;

    &:hover {
      text-decoration: none;
    }
  }
`;

const Box = styled.div`
  display: flex;
  width: 200px;
  padding: 40px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  border-radius: 16px;
  background: var(--bg-2, #23242b);

  cursor: pointer;

  h3 {
    color: var(--white-100, #fff);

    /* H3/Small */
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%; /* 28px */
  }
`;

const SelectionBox = ({ title, selected, value }) => {
  return (
    <Box onClick={() => setSelection(value)}>
      {selected ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"
            fill="#eca227"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
            fill="white"
          />
        </svg>
      )}
      <h3>{title}</h3>
    </Box>
  );
};

return (
  <Container>
    <Card>
      {view === "selection" ? (
        <>
          <h1>What would you like to do?</h1>
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-4">
            <SelectionBox
              title={"Make changes to the existing page"}
              selected={selection === 1}
              value={1}
            />
            <SelectionBox
              title={"Propose a new page"}
              selected={selection === 2}
              value={2}
            />
          </div>
          <span className={`${selection === 0 && "disabled"}`}>
            <Link
              href={selection === 1 ? "/edit" : "#"}
              onClick={() => selection === 2 && setView("proposal")}
            >
              Continue{" "}
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
            </Link>
          </span>
        </>
      ) : (
        <Widget src="/*__@appAccount__*//widget/propose-widget" />
      )}
    </Card>
  </Container>
);
