import { createContext } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/types";
import { useState } from "react";
import { useContext } from "react";

interface userContext {
    user: User | null;
    setUser: (user: User | null) => void; //metoden får ta emot en user eller ingen user. metoden returnerar inget.
}
//UserContextType är ett kontrakt som säger:
//Mitt Context ska innehålla en användare och en funktion för att ändra användaren.
const UserContext = createContext<userContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
} //Vi har skapat ett UserContext som gör det möjligt att dela information om den inloggade användaren mellan olika komponenter i React, utan att behöva skicka den via props.
//Sedan skapade vi en UserProvider som håller reda på användaren med useState.
// Från början är användaren null, men med setUser kan vi ändra det.
// Providern delar sedan ut både user och setUser till alla komponenter som ligger inuti den (children).
export function useUser() {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUser måste användas inom UserProvider");
    }

    return context;
}
