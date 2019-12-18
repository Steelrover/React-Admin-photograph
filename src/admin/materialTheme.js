import { createMuiTheme } from "@material-ui/core";
import red from "@material-ui/core/colors/red";

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: {
      main: red[900],
    },
    secondary: {
      main: '#373737',
    },
  },
});

export { defaultMaterialTheme }
