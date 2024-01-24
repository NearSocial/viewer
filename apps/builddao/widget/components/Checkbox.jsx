const CheckboxInput = styled.input`
  display: none;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  padding: 12px;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  max-width: 100%;

  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

function Checkbox({ className, value, onChange, label }) {
  return (
    <div key={`Checkbox-${label ?? "No-label"}`} style={{ maxWidth: "100%" }}>
      <CheckboxLabel>
        <CheckboxInput type="checkbox" checked={value} onChange={onChange} />
        {value ? (
          <i style={{ cursor: "pointer" }} className="bi bi-check-square"></i>
        ) : (
          <i style={{ cursor: "pointer" }} className="bi bi-square"></i>
        )}
        <span className={className}>{label}</span>
      </CheckboxLabel>
    </div>
  );
}

return { Checkbox };
