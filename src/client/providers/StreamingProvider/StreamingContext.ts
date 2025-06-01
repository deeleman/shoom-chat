import { createContext } from "react";
import type { StreamingContextType } from "./types";

export const StreamingContext = createContext<StreamingContextType | undefined>(undefined);
