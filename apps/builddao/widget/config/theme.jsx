const theme = `
  --stroke-color: rgba(255, 255, 255, 0.2);
  --bg-1: #0b0c14;
  --bg-1-hover: #17181c;
  --bg-1-hover-transparent: rgba(23, 24, 28, 0);
  --bg-2: ##23242b;
  --label-color: #fff;
  --font-color: #fff;
  --font-muted-color: #cdd0d5;
  --black: #000;
  --system-red: #fd2a5c;
  --yellow: #ffaf51;

  --compose-bg: #23242b;

  --post-bg: #0b0c14;
  --post-bg-hover: #17181c;
  --post-bg-transparent: rgba(23, 24, 28, 0);

  --button-primary-bg: #ffaf51;
  --button-outline-bg: transparent;
  --button-default-bg: #23242b;

  --button-primary-color: #000;
  --button-outline-color: #fff;
  --button-default-color: #cdd0d5;

  --button-primary-hover-bg: #e49b48;
  --button-outline-hover-bg: rgba(255, 255, 255, 0.2);
  --button-default-hover-bg: #17181c;
`;

return { type: "theme", theme: theme };
