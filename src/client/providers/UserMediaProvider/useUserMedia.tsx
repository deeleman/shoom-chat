import { useContext } from "react"
import { UserMediaContext } from "./UserMediaContext"

export const useUserMedia = () => {
  const contextStream = useContext(UserMediaContext);

  return contextStream
}