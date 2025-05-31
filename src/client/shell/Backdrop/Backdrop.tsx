import { type PropsWithChildren } from "react";
import { useTheme } from '@twilio-paste/theme';

export const Backdrop: React.FC<PropsWithChildren> = ({ children }): React.ReactElement => {
  const { colorSchemes } = useTheme();
  const colorScheme = colorSchemes.colorScheme || 'light';

  return (
    <>
      <div id="backdrop" className={`backdrop--${colorScheme}`}>
        <ul className={`backdrop__circles backdrop--${colorScheme}`}>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      {children}
    </>
  );
}