const InputContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const Label = styled.label`
  color: var(--label-color, #fff);

  /* Body/16px */
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

const Input = styled.input`
  display: flex;
  width: 100%;
  padding: 12px;
  align-items: flex-start;
  gap: 10px;

  border-radius: 8px;
  border: 1px solid var(--stroke-color, rgba(255, 255, 255, 0.2));
  background: var(--bg-1, #000000);

  flex: 1 0 0;

  color: var(--font-muted-color, #cdd0d5);

  /* Body/16px */
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

function InputField({
  type,
  label,
  key,
  placeholder,
  value,
  onChange,
  maxWidth,
}) {
  return (
    <InputContainer
      key={`input-container-${key}`}
      style={{ maxWidth: maxWidth ?? "390px" }}
    >
      {label && <Label>{label}</Label>}
      <Input
        key={`input-field-${key}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type ?? "text"}
        style={{ maxWidth: maxWidth ?? "390px" }}
      />
    </InputContainer>
  );
}

return { InputField };
