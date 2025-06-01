import { useContext } from "react"
import { UserMediaContext } from "./UserMediaContext"

export const useUserMedia = () => {
  const context = useContext(UserMediaContext);

  if (!context) {
    throw new Error(
      'The useUserMedia() hook must be executed in a component inside a <UserMediaProvider> element.'
    )
  }

  return context
}