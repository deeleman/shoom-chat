import { useContext } from "react"
import { ThemeContext } from "./ThemeContext"

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'The useTheme() hook must be executed in a component inside a <ThemeProvider> element.'
    )
  }

  return context
}