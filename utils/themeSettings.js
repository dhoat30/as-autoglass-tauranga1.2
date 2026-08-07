import { createTheme } from "@mui/material/styles";
//export theme settings

export const lightTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#F6B91A",
      contrastText: "#181200",
    },
    secondary: {
      main: "#62B393",
      contrastText: "#061D14",
    },
    tertiary: {
      main: "#8AB9C4",
    },
    background: {
      default: "#0B100D",
      paper: "#151D18",
    },
    text: {
      primary: "#F4F7F2",
      secondary: "#B9C4BA",
    },
    contrastThreshold: 4.5,
  },
  typography: {
    fontFamily: ["var(--font-work-sans)", "Segoe UI", "sans-serif"].join(","),

    h1: {
      fontSize: "4.5rem",
      fontWeight: 800,
      color: "var(--light-on-surface)",
      lineHeight: "110%",
  letterSpacing: "-0.01em", 

      fontFamily: ["var(--font-prompt)", "Segoe UI", "sans-serif"].join(","),

      "@media (max-width:900px)": {
        fontSize: "2.5rem",
      },
    },
    h2: {
      fontWeight: 800,
      fontSize: "3rem",
      lineHeight: "110%",
      color: "var(--light-on-surface)",
      fontFamily: ["var(--font-prompt)", "Segoe UI", "sans-serif"].join(","),

      "@media (max-width:600px)": {
        fontSize: "2rem",
        lineHeight: "2.4rem",
      },
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "0.05rem",
      color: "var(--light-on-surface)",
      fontFamily: ["var(--font-prompt)", "Segoe UI", "sans-serif"].join(","),

      "@media (max-width:600px)": {
        fontSize: "1.7rem",
        lineHeight: "2.2rem",
      },
    },
    h4: {
      fontFamily: ["var(--font-prompt)", "Segoe UI", "sans-serif"].join(","),

      fontWeight: 700,
      color: "var(--light-on-surface)",
    },
    h5: {
      fontFamily: ["var(--font-work-sans)", "Segoe UI", "sans-serif"].join(","),
lineHeight: "140%",
      fontWeight: 700,
      color: "var(--light-on-surface)",
      "@media (max-width:600px)": {
        fontSize: "1.2rem",
      },
    },

    h6: {
      fontFamily: ["var(--font-work-sans)", "Segoe UI", "sans-serif"].join(","),
      fontWeight: 600,
      color: "var(--light-on-surface)",
      fontSize: "1.15rem",
    },
    body1: {
      fontFamily: ["var(--font-work-sans)", "Segoe UI", "sans-serif"].join(","),
      fontSize: "1rem",
      color: "var( --light-on-surface-variant)",
      lineHeight:"140%", 
        letterSpacing: "-0.02rem"
    },
    body2: {
      fontFamily: ["var(--font-work-sans)", "Segoe UI", "sans-serif"].join(","),
    },
    subtitle1: {
      fontFamily: ["var(--font-work-sans)", "Segoe UI", "sans-serif"].join(","),
      color: "var(--light-on-surface-variant)",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          color: "var(--light-on-primary)",
         padding: "12px 40px",
          fontSize: "1.1rem",
          textTransform: "inherit",
          boxShadow: "none",
          fontWeight: "500",
        },
        contained: {
          background:
            "var(--light-primary)",
          color: "var(--light-on-primary)",
          boxShadow: "none",
          transition:
            "background-color 180ms ease, color 180ms ease, transform 180ms ease",
          "& .MuiButton-endIcon": {
            transition: "transform 180ms ease",
          },
          "&:hover": {
            backgroundColor: "var(--brand-kowhai-bright)",
            boxShadow: "none",
          },
          "&.MuiButton-colorPrimary:hover": {
            transform: "translateY(-2px)",
            "& .MuiButton-endIcon": {
              transform: "translateX(3px)",
            },
          },
          "&.MuiButton-colorPrimary:active": {
            transform: "translateY(0)",
            "& .MuiButton-endIcon": {
              transform: "translateX(0)",
            },
          },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
            "& .MuiButton-endIcon": {
              transition: "none",
            },
          },
        },
        outlined: {
          border: "1px solid var(--light-primary)",
          color: "var(--light-primary)",
        },
        text: {
          color: "var(--light-primary)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "flex-start",
          textAlign: "left",
          padding: "12px 0",
          minWidth: 0,
          lineHeight: "1.2",
          "&:hover": {
            backgroundColor: "transparent",
            color: "var(--light-primary-fixed-dim)",
            textDecoration: "underline",
            textUnderlineOffset: "4px",
          },
          "& .MuiButton-startIcon, & .MuiButton-endIcon": {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            flexShrink: 0,
            lineHeight: 1,
          },
          "& .MuiButton-startIcon": {
            marginRight: "6px",
          },
          "& .MuiButton-endIcon": {
            marginLeft: "6px",
          },
          "& .MuiButton-startIcon > *:nth-of-type(1), & .MuiButton-endIcon > *:nth-of-type(1)": {
            fontSize: "1.1em",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--light-primary)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--light-primary)",
            borderWidth: "2px",
          },
        },
        notchedOutline: {
          borderColor: "var(--light-outline-variant)",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "var(--light-primary)",
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "var(--light-primary)",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "var(--light-primary)",
          "&.Mui-checked": {
            color: "var(--light-primary)",
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "var(--light-primary)",
          "&.Mui-checked": {
            color: "var(--light-primary)",
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "var(--light-primary)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-colorSecondary": {
            borderColor: "var(--light-primary)",
            color: "var(--light-primary)",
          },
          "&.MuiChip-filled.MuiChip-colorSecondary": {
            backgroundColor: "var(--light-primary)",
            color: "var(--light-on-primary)",
          },
        },
      },
    },
  },
});
// mui theme settings
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
        primary: {
      main: "#1D1F2A",
    },
    secondary: {
      main: "#BF7F07",
    },
    tertiary: {
      main: "#C7B79D",
    },
    contrastThreshold: 4.5,
  },
  typography: {
    fontFamily: ["var(--font-prompt)", "Segoe UI", "sans-serif"].join(","),
    h1: {
      fontFamily: ["var(--font-prompt)", "Segoe UI", "sans-serif"].join(","),

      fontSize: "5rem",
      fontWeight: 600,
      color: "var(--dark-on-surface)",
      "@media (max-width:900px)": {
        fontSize: "3rem",
      },
    },
    h2: {
      fontFamily: ["var(--font-prompt)", "Segoe UI", "sans-serif"].join(","),

      fontWeight: 600,
      color: "var(--dark-on-surface)",
      "@media (max-width:600px)": {
        fontSize: "2.5rem",
      },
    },
    h3: {
      fontFamily: ["var(--font-prompt)", "Segoe UI", "sans-serif"].join(","),

      fontWeight: 600,
      letterSpacing: "0.05rem",
      color: "var(--dark-on-surface)",
    },
    h4: {
      fontFamily: ["var(--font-prompt)", "Segoe UI", "sans-serif"].join(","),
      fontWeight: 500,
      color: "var(--dark-on-surface)",

      "@media (max-width:900px)": {
        fontSize: "1.5rem",
      },
    },
    h5: {
      fontWeight: 400,
      letterSpacing: "0.02rem",

      color: "var(--dark-on-surface)",
    },

    h6: {
      fontWeight: 400,
      letterSpacing: "0.02rem",
      color: "var(--dark-on-surface)",
    },
    body1: {
      fontWeight: 350,
      letterSpacing: "0.02rem",
      color: "var( --dark-on-surface-variant)",
    },
    body2: {
      fontWeight: 300,
      letterSpacing: "0.05rem",
    },
    subtitle1: {
      color: "var(--dark-on-surface)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
          transition:
            "background-color 180ms ease, color 180ms ease, transform 180ms ease",
          "& .MuiButton-endIcon": {
            transition: "transform 180ms ease",
          },
          "&:hover": {
            boxShadow: "none",
          },
          "&.MuiButton-colorPrimary:hover": {
            transform: "translateY(-2px)",
            "& .MuiButton-endIcon": {
              transform: "translateX(3px)",
            },
          },
          "&.MuiButton-colorPrimary:active": {
            transform: "translateY(0)",
            "& .MuiButton-endIcon": {
              transform: "translateX(0)",
            },
          },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
            "& .MuiButton-endIcon": {
              transition: "none",
            },
          },
        },
        text: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "flex-start",
          textAlign: "left",
          padding: "12px 0",
          minWidth: 0,
          lineHeight: "1.2",
          color: "var(--dark-on-surface)",
          "&:hover": {
            backgroundColor: "transparent",
            color: "var(--dark-primary)",
            textDecoration: "underline",
            textUnderlineOffset: "4px",
          },
          "& .MuiButton-startIcon, & .MuiButton-endIcon": {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            flexShrink: 0,
            lineHeight: 1,
          },
          "& .MuiButton-startIcon": {
            marginRight: "6px",
          },
          "& .MuiButton-endIcon": {
            marginLeft: "6px",
          },
          "& .MuiButton-startIcon > *:nth-of-type(1), & .MuiButton-endIcon > *:nth-of-type(1)": {
            fontSize: "1.1em",
          },
        },
      },
    },
  },
});
