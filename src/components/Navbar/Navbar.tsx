import "../Navbar/Navbar.css";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { Link } from "react-router";
import UserCard from "../UserCard/UserCard";

interface NavbarProps {
    activePage: string;
}

function Navbar({ activePage }: NavbarProps) {
    const { user } = useUser();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const username = user?.userName ?? "";
    const userTag = username
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((name) => name.charAt(0).toUpperCase())
        .join("");

    // Stänger menyn vid klick utanför eller när man trycker Escape
    useEffect(() => {
        if (!menuOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setMenuOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
                buttonRef.current?.focus();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuOpen]);

    return (
        <div className="navbar">
            <h2>Meetly</h2>
            {activePage != "HomePage" && (
                <Link className="NavButton" to="/home">
                    Tillbaka
                </Link>
            )}
            <div className="UserNameSection UserMenu" ref={menuRef}>
                <button
                    ref={buttonRef}
                    type="button"
                    className="UserMenuButton"
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span className="UserName">{username}</span>
                    <span className="NameTag">{userTag}</span>
                </button>

                {menuOpen && user && (
                    <div className="UserMenuPanel">
                        <UserCard
                            user={user}
                            showProfileLink={activePage !== "profile"}
                            onNavigate={() => setMenuOpen(false)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
