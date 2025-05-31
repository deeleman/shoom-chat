import { useTheme as usePasteTheme, Theme as PasteTheme } from '@twilio-paste/theme';
import React, { useMemo, useState, type PropsWithChildren } from "react";
import { type ThemeContextProps, ThemeContext } from "./ThemeContext";
import { Theme } from './types';

type ThemeProviderProps = PropsWithChildren<{
  defaultTheme?: Theme;
}>;

const FALLBACK_THEME: Theme = 'dark';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme }): React.ReactElement => {
  const { colorSchemes } = usePasteTheme()
  const [theme, setTheme] = useState(defaultTheme || colorSchemes.colorScheme || FALLBACK_THEME);
  
  const themeProviderProps = useMemo<ThemeContextProps>(() => ({
    setTheme,
    theme,
  }), [theme, setTheme]);

  return (
    <PasteTheme.Provider theme={theme}>
      <ThemeContext.Provider value={themeProviderProps}>
        {children}
      </ThemeContext.Provider>
    </PasteTheme.Provider>
  );
};
