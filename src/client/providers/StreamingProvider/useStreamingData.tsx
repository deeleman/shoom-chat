import { useContext } from "react"
import { StreamingContext } from "./StreamingContext"

export const useStreamingData = () => {
  const contextStream = useContext(StreamingContext);

  if (!contextStream) {
    throw new Error(
      'The useStreamingData() hook must be executed in a component inside a <StreamingProvider> element.'
    )
  }

  return contextStream
}