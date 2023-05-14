// color design tokens export
export const colorTokens = {
    grey: {
      0: "#FFFFFF",
      10: "#F6F6F6",
      15: "rgba(255, 255, 255, 0.675)",
      50: "#F0F0F0",
      100: "#E0E0E0",
      200: "#C2C2C2",
      300: "#A3A3A3",
      400: "#858585",
      500: "#666666",
      600: "#4D4D4D",
      700: "#333333",
      800: "#1A1A1A",
      900: "#0A0A0A",
      950: "rgba(0, 0, 0, 0.655)",
      1000: "#000000",
    },
    primary: {
      50: "#e6ffef",
      100: "#cbf8db",
      200: "#97fdbb",
      300: "#60fe97",
      400: "#26fc71",
      500: "#05fc5b",
      600: "#01ae3e",
      700: "#027329",
      800: "#003413",
      900: "#001909",
      // 50: "#E6FBFF",
      // 100: "#CCF7FE",
      // 200: "#99EEFD",
      // 300: "#66E6FC",
      // 400: "#33DDFB",
      // 500: "#00D5FA",
      // 600: "#00A0BC",
      // 700: "#006B7D",
      // 800: "#00353F",
      // 900: "#001519",
    },
  };

//   mui theme settings
export const themeSettings = (mode) => {
    return {
      palette: {
        mode: mode,
        ...(mode === "dark"
          ? {
              // palette values for dark mode
              primary: {
                dark: colorTokens.primary[200],
                main: colorTokens.primary[500],
                light: colorTokens.primary[800],
                lighter: colorTokens.primary[900],
              },
              neutral: {
                darker: colorTokens.grey[50],
                dark: colorTokens.grey[100],
                main: colorTokens.grey[200],
                mediumMain: colorTokens.grey[300],
                medium: colorTokens.grey[400],
                lesslight: colorTokens.grey[600],
                light: colorTokens.grey[700],
              },
              background: {
                default: colorTokens.grey[900],
                alt: colorTokens.grey[800],
                transparent: colorTokens.grey[850],
              },
            }
          : {
              // palette values for light mode
              primary: {
                dark: colorTokens.primary[700],
                main: colorTokens.primary[500],
                light: colorTokens.primary[100],
                light: colorTokens.primary[50],
              },
              neutral: {
                darker: colorTokens.grey[900],
                dark: colorTokens.grey[700],
                main: colorTokens.grey[500],
                mediumMain: colorTokens.grey[400],
                medium: colorTokens.grey[300],
                lesslight: colorTokens.grey[100],
                light: colorTokens.grey[50],
              },
              background: {
                default: colorTokens.grey[10],
                alt: colorTokens.grey[0],
                transparent: colorTokens.grey[15],
              },
            }),
      },
      typography: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 12,
        h1: {
          fontFamily: ["Rubik", "sans-serif"].join(","),
          fontSize: 40,
        },
        h2: {
          fontFamily: ["Rubik", "sans-serif"].join(","),
          fontSize: 32,
        },
        h3: {
          fontFamily: ["Rubik", "sans-serif"].join(","),
          fontSize: 24,
        },
        h4: {
          fontFamily: ["Rubik", "sans-serif"].join(","),
          fontSize: 20,
        },
        h5: {
          fontFamily: ["Rubik", "sans-serif"].join(","),
          fontSize: 16,
        },
        h6: {
          fontFamily: ["Rubik", "sans-serif"].join(","),
          fontSize: 14,
        },
      },
    };
  };