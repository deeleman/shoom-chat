import { createContext } from "react";
import { type MediaDevicesUtils } from "./types";

export const MediaDevicesContext = createContext<MediaDevicesUtils | undefined>(undefined);
