function InputField({ value, onChange, label, type, placeholder, maxWidth }) {
  return (
    <Widget
      src="buildhub.near/widget/components.input-field-widget"
      props={{
        value,
        onChange,
        label,
        type,
        placeholder,
        maxWidth,
      }}
    />
  );
}

return { InputField };
