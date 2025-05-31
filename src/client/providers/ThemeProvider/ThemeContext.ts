import { createContext } from "react";
import { type Theme } from "./types";

export type ThemeContextProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
