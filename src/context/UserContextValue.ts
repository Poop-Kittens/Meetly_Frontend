import { createContext } from "react";
import type { UserResponse } from "../types/types";

export interface UserContextType {
  user: UserResponse | null;
  setUser: (user: UserResponse | null) => void;
  loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
