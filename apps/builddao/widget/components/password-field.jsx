function PasswordField({ value, onChange, label, placeholder, maxWidth }) {
  return (
    <Widget
      src="buildhub.near/widget/components.input-field-widget"
      props={{
        value,
        onChange,
        label,
        type: "password",
        placeholder,
        maxWidth,
      }}
    />
  );
}

return { PasswordField };
