import { createContext } from "react";
import type { ReactNode } from "react";
import type { UserResponse } from "../types/types";
import { useState } from "react";
import { useContext } from "react";

// Beskriver vilken information vi vill dela mellan komponenterna.
// user = användaren (eller null om ingen finns).
// setUser = funktionen som ändrar användaren.
// void betyder att funktionen inte returnerar något.
interface userContext {
  user: UserResponse | null;
  setUser: (user: UserResponse | null) => void;
}

// Skapar ett Context-objekt och sparar det i konstanten UserContext.
// Det används sedan av både Provider (som delar ut information)
// och useContext (som läser informationen).
// <userContext | undefined> anger vilka typer Context får innehålla.
// undefined är standardvärdet om ingen Provider finns.
const UserContext = createContext<userContext | undefined>(undefined);

// Skapar en komponent som ska omsluta andra komponenter.
// children är allt som ligger mellan <UserProvider> och </UserProvider>.
// ReactNode betyder att children får vara sådant React kan visa.
export function UserProvider({ children }: { children: ReactNode }) {
  // Skapar en variabel (user) och en funktion (setUser) som ändrar den.
  // User | null betyder att variabeln får innehålla en användare eller null.
  // Vi börjar med null eftersom ingen användare har hämtats ännu.
  const [user, setUser] = useState<UserResponse | null>(null);

  return (
    // Provider gör informationen tillgänglig för komponenterna inuti.
    // value bestämmer vad vi delar: både user och setUser.
    <UserContext.Provider value={{ user, setUser }}>
      {/* Visar komponenterna som UserProvider omsluter, t.ex. App. */}
      {children}
    </UserContext.Provider>
  );
}

// En egen funktion (custom hook) som andra komponenter kan använda
// för att få tillgång till informationen i UserContext.
export function useUser() {
  // Hämtar värdet från närmaste UserContext.Provider ovanför komponenten.
  // Det innehåller både user och setUser.
  const context = useContext(UserContext);

  // Om ingen Provider finns får vi undefined.
  // Då visar vi ett fel istället för att fortsätta.
  if (context === undefined) {
    throw new Error("useUser måste användas inom UserProvider");
  }

  // Skickar tillbaka user och setUser till komponenten som anropade useUser().
  return context;
}
