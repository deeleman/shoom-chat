import { Switch } from "@twilio-paste/core/Switch";
import { DarkModeIcon } from "@twilio-paste/icons/esm/DarkModeIcon";
import { LightModeIcon } from "@twilio-paste/icons/esm/LightModeIcon";
import { useCallback, useMemo } from "react";
import { useTheme } from "../../providers";

export const ThemeSwitch: React.FC = (): React.ReactElement => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [setTheme, theme]);

  const isDarkMode = useMemo(() => {
    return theme === 'dark';
  }, [theme]);

  return (
    <Switch name="theme" checked={isDarkMode} onChange={toggleTheme}>
      {isDarkMode
        ? <DarkModeIcon decorative={false} title="Dark mode" />
        : <LightModeIcon decorative={false} title="Light mode" />
      }
    </Switch>
  );
};
