const CheckboxInput = styled.input`
  display: none;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  padding: 12px;
  align-items: center;
  gap: 8px;

  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

function Checkbox({ value, onChange, label }) {
  return (
    <div key={`Checkbox-${label ?? "No-label"}`}>
      <CheckboxLabel>
        <CheckboxInput type="checkbox" checked={value} onChange={onChange} />
        {value ? (
          <i className="bi bi-check-square"></i>
        ) : (
          <i className="bi bi-square"></i>
        )}
        {label}
      </CheckboxLabel>
    </div>
  );
}

return { Checkbox };