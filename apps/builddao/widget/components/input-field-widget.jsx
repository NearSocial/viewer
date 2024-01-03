const value = props.value;
const onChange = props.onChange;
const label = props.label;
const type = props.type;
const placeholder = props.placeholder;
const maxWidth = props.maxWidth ?? "390px";
const [showPassword, setShowPassword] = useState(false);

const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const Label = styled.label`
  color: var(--White-100, #fff);

  /* Body/16px */
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

const Input = styled.input`
  display: flex;
  max-width: ${maxWidth};
  width: 100%;
  padding: 16px 12px;
  align-items: flex-start;
  gap: 10px;

  border-radius: 8px;
  border: 1px solid var(--Stroke-color, rgba(255, 255, 255, 0.2));
  background: var(--Bg-1, #0b0c14);

  flex: 1 0 0;

  color: var(--White-50, #cdd0d5);

  /* Body/16px */
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 27.2px */
`;

return (
  <Container>
    <Label htmlFor={label}>{label}</Label>
    <div
      className="position-relative d-flex w-100"
      style={{ maxWidth: maxWidth }}
    >
      <Input
        name={label}
        id={label}
        value={value}
        onChange={onChange}
        type={!showPassword ? type : "text"}
        placeholder={placeholder}
      />
      {type === "password" && (
        <span
          className="position-absolute"
          style={{
            right: "0.5rem",
            top: "30%",
            transform: "translateX(-50%)",
            color: "#fff",
          }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <i className="bi bi-eye"></i>
          ) : (
            <i className="bi bi-eye-slash"></i>
          )}
        </span>
      )}
    </div>
  </Container>
);
