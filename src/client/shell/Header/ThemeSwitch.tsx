import { Switch } from "@twilio-paste/core/Switch";
import { DarkModeIcon } from "@twilio-paste/icons/esm/DarkModeIcon";
import { LightModeIcon } from "@twilio-paste/icons/esm/LightModeIcon";
import { useTheme } from '@twilio-paste/theme';
import { useCallback, useMemo, useState } from "react";

export const ThemeSwitch: React.FC = (): React.ReactElement => {
  const { colorSchemes } = useTheme();
  const [colorScheme, setColorScheme] = useState(colorSchemes.colorScheme || 'dark');

  const toggleTheme = useCallback(() => {
    setColorScheme((colorScheme: typeof colorSchemes.colorScheme) => colorScheme === 'light' ? 'dark' : 'light');
  }, []);

  const isDarkMode = useMemo(() => {
    return colorScheme === 'dark';
  }, [colorScheme]);

  return (
    <Switch name="colorScheme" checked={isDarkMode} onChange={toggleTheme}>
      {isDarkMode
        ? <DarkModeIcon decorative={false} title="Dark mode" />
        : <LightModeIcon decorative={false} title="Light mode" />
      }
    </Switch>
  );
};
