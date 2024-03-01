const Container = styled.div`
  display: flex;
  padding: 12px 20px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  width: max-content;

  border-radius: 100px;
  border: 1px solid var(--eca-227, #eca227);
  background: rgba(236, 162, 39, 0.2);

  span {
    color: var(--eca-227, #eca227);
    text-align: center;
    font-family: "Zen Kaku Gothic Antique", sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-transform: capitalize;
  }

  @media screen and (max-width: 768px) {
    padding: 8px 16px;

    span {
      font-size: 12px;
    }
  }
`;

const Tag = ({ label }) => {
  return (
    <Container>
      <span>{label}</span>{" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
      >
        <g clip-path="url(#clip0_1423_5056)">
          <path
            d="M4.5 14.5L14.5 4.5L12.5 2.5L2.5 12.5L4.5 14.5Z"
            stroke="#ECA227"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 4.5L12.5 6.5"
            stroke="#ECA227"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.50033 2.5C6.50033 2.85362 6.6408 3.19276 6.89085 3.44281C7.1409 3.69286 7.48004 3.83333 7.83366 3.83333C7.48004 3.83333 7.1409 3.97381 6.89085 4.22386C6.6408 4.47391 6.50033 4.81304 6.50033 5.16667C6.50033 4.81304 6.35985 4.47391 6.1098 4.22386C5.85975 3.97381 5.52061 3.83333 5.16699 3.83333C5.52061 3.83333 5.85975 3.69286 6.1098 3.44281C6.35985 3.19276 6.50033 2.85362 6.50033 2.5Z"
            stroke="#ECA227"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.1663 9.16699C13.1663 9.52061 13.3068 9.85975 13.5569 10.1098C13.8069 10.3598 14.1461 10.5003 14.4997 10.5003C14.1461 10.5003 13.8069 10.6408 13.5569 10.8909C13.3068 11.1409 13.1663 11.48 13.1663 11.8337C13.1663 11.48 13.0259 11.1409 12.7758 10.8909C12.5258 10.6408 12.1866 10.5003 11.833 10.5003C12.1866 10.5003 12.5258 10.3598 12.7758 10.1098C13.0259 9.85975 13.1663 9.52061 13.1663 9.16699Z"
            stroke="#ECA227"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_1423_5056">
            <rect
              width="16"
              height="16"
              fill="white"
              transform="translate(0.5 0.5)"
            />
          </clipPath>
        </defs>
      </svg>
    </Container>
  );
};

return { Tag };
