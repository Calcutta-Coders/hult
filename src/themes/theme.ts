import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Arial', sans-serif", // Default font stack
    h1: { fontWeight: 600, fontSize: "2.5rem" },
    h4: { fontWeight: 600, fontSize: "1.5rem" },
    body1: { fontWeight: 400, fontSize: "1rem" },
    button: { textTransform: "none" },
  },
});

export default theme;
