const colors = {
  yellow500: "#FFAF51",
  seablue500: "#51FFEA",
  blue500: "#51B6FF",
  bg1: "#0B0C14",
  bg2: "#23242B",
  black100: "#000000",
  black50: "Black/50",
  white100: "#FFFFFF",
  white50: "White/50",
  error: "#FD2A5C",
  success: "#38C793",
  warning: "#F17B2C",
};

Storage.set("theme", { colors });

const theme = Storage.get("theme");

function ThemeProvider({ children }) {
  return <div {...theme}>{children}</div>;
}

return { ThemeProvider, theme };