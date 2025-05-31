import { type PropsWithChildren } from "react";
import { useTheme } from "../../providers";

export const Backdrop: React.FC<PropsWithChildren> = ({ children }): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <>
      <div id="backdrop" className={`backdrop--${theme}`}>
        <ul className={`backdrop__circles backdrop__circles--${theme}`}>
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