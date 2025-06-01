import { createContext } from "react";

export const UserMediaContext = createContext<MediaStream | undefined>(undefined);
