import { createContext } from "react";
import type { UserMediaData } from "./types";

export const UserMediaContext = createContext<UserMediaData | undefined>(undefined);
