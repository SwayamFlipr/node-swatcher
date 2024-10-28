import { COLORS } from "./constants.js";

export const colorLog = (color, input) => {
  if (!color) throw new Error("color is required for color log");
  console.log(COLORS.Reset, color, input, COLORS.Reset);
};
