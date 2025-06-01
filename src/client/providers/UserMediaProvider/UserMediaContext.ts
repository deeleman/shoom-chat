import { createContext } from "react";

export const UserMediaContext = createContext<{ stream?: MediaStream }>({ stream: undefined });
