const Label = styled.label`
  color: var(--White-100, #fff);

  /* Body/16px */
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;


const TextArea = styled.textarea`
  display: flex;
  min-height: 100px;
  padding: 16px 12px;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;

  border-radius: 8px;
  border: 1px solid var(--Stroke-color, rgba(255, 255, 255, 0.2));
  background: var(--Bg-1, #0b0c14);

  color: var(--White-50, #fff);

  /* Body/16px */
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

function TextBox({ label, value, onChange, placeholder, maxWidth }) {
  return (
    <div
      className="d-flex flex-column gap-1 w-100"
      style={{ maxWidth: maxWidth ? maxWidth : "550px" }}
    >
      <Label>{label}</Label>
      <TextArea placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}

return { TextBox };