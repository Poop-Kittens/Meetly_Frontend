import "../Navbar/Navbar.css";
import { useUser } from "../../context/UserContext";

interface NavbarProps {
    activePage: string;
    activeUser: string;
}

function Navbar({ activeUser, activePage }: NavbarProps) {
    const userTag = activeUser
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((name) => name.charAt(0).toUpperCase())
        .join("");

    return (
        <div className="navbar">
            <h2>Meetly</h2>
            {activePage != "HomePage" && <a className="NavButton">Go back</a>}
            <div className="UserNameSection">
                <h2 className="UserName">{activeUser}</h2>
                <p className="NameTag">{userTag}</p>
            </div>
        </div>
    );
}

export default Navbar;
