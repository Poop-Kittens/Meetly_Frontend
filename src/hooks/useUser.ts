import { useContext } from "react";
import { UserContext } from "../context/UserContextValue";

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser måste användas inom UserProvider");
  }
  return context;
}
