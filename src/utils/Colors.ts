import SparkMD5 from "spark-md5";

/**
 * Basic colors used in the app and their hex values.
 */
export const Colors = {
  // paper & background
  paper: "#ffffff",
  Primary: {
    primaryLight: "#e3f2fd",
    primaryMain: "#2196f3",
    primaryDark: "#1e88e5",
    primary200: "#90caf9",
    primary800: "#1565c0",
  },
  Secondary: {
    secondaryLight: "#ede7f6",
    secondaryMain: "#673ab7",
    secondaryDark: "#5e35b1",
    secondary200: "#b39ddb",
    secondary800: "#4527a0",
  },
  Success: {
    successLight: "#b9f6ca",
    success200: "#69f0ae",
    successMain: "#00e676",
    successDark: "#00c853",
  },
  Error: {
    errorLight: "#ef9a9a",
    errorMain: "#f44336",
    errorDark: "#c62828",
  },
  Orange: {
    orangeLight: "#fbe9e7",
    orangeMain: "#ffab91",
    orangeDark: "#d84315",
  },
  Warning: {
    warningLight: "#fff8e1",
    warningMain: "#ffe57f",
    warningDark: "#ffc107",
  },
  Grey: {
    grey50: "#fafafa",
    grey100: "#f5f5f5",
    grey200: "#eeeeee",
    grey300: "#e0e0e0",
    grey500: "#9e9e9e",
    grey600: "#757575",
    grey700: "#616161",
    grey900: "#212121",
  },
  MainDark: "#121432",
  MainBlue: "#2B7DE9",
  SecondaryOnDark: "#C1BEBE",
  MainOnDark: "#FFFFFF",
  MainOnWhite: "#F7F7F7",
  MainBlack: "#000000",
  SecondaryBlack: "#61657E",
  Green: {
    Main: "#68AEA0",
    Light: "#E3F5F0",
  },
  Blue: {
    Main: "#94BDEA",
    Light: "#F3F8FF",
  },
  Yellow: {
    Main: "#EBD964",
    Light: "#FDFCED",
  },
  Notes: "#FFFB99",
  SecondaryOnWhite: "#C1BEBE",
  /**
   * Calculates the contrast color for a given background color.
   * @param hex - The hex value of the color.
   * @returns The contrast color.
   */
  CalculateContrast: (hex: string) => {
    const threshold = 130;

    const colorBrightness =
      (hexToRed(hex) * 299 + hexToGreen(hex) * 587 + hexToBlue(hex) * 114) /
      1000;

    function cleanHex(h: string) {
      return h.charAt(0) === "#" ? h.substring(1, 7) : h;
    }
    function hexToRed(h: string) {
      return parseInt(cleanHex(h).substring(0, 2), 16);
    }
    function hexToGreen(h: string) {
      return parseInt(cleanHex(h).substring(2, 4), 16);
    }
    function hexToBlue(h: string) {
      return parseInt(cleanHex(h).substring(4, 6), 16);
    }

    return colorBrightness > threshold ? "#000000" : "#ffffff";
  },
};

export function wordToColor(word: string): string {
  const normalizedString = word.toLowerCase().trim();
  // Calculate the MD5 hash using SparkMD5 library
  const hash = SparkMD5.hash(normalizedString);

  // Convert the hash to a hexadecimal string
  const colorHex = hash.substring(0, 6);

  // Return the color code
  return "#" + colorHex;
}

// Generate a lightened color from a given color
export function lightenColor(color: string, percent: number): string {
  // Convert the hex color to RGB
  const colorRgb = hexToRgb(color);

  // Calculate the lightened color
  const lightenedColor = {
    r: Math.floor((1 + percent) * colorRgb.r),
    g: Math.floor((1 + percent) * colorRgb.g),
    b: Math.floor((1 + percent) * colorRgb.b),
  };

  // Return the lightened color in hex format
  return rgbToHex(lightenedColor.r, lightenedColor.g, lightenedColor.b);
}

const hexToRgb = (hex: string) => {
  // Remove the hash if it exists
  hex = hex.replace("#", "");

  // Convert the hex string to RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Return the RGB values as an object
  return {r, g, b};
};

const rgbToHex = (r: number, g: number, b: number) => {
  // Convert the RGB values to hex
  const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  // Return the hex color code
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
