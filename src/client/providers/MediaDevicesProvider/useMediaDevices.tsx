import { useContext } from "react"
import { MediaDevicesContext } from "./MediaDevicesContext"
import { type MediaDevicesUtils } from "./types"

export const useMediaDevices = (): MediaDevicesUtils => {
  const context = useContext(MediaDevicesContext);

  if (!context) {
    throw new Error(
      'The useMediaDevices() hook must be executed in a component inside a <MediaDevicesProvider> element.'
    )
  }

  return context;
};
