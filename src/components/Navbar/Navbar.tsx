import "../Navbar/Navbar.css";
import { useUser } from "../../context/userContext";

interface NavbarProps {
    activePage: string;
}

function Navbar({ activePage }: NavbarProps) {
    const { user } = useUser();
    let username = user?.userName ?? "";
    const userTag = username
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
                <h2 className="UserName">{username}</h2>
                <p className="NameTag">{userTag}</p>
            </div>
        </div>
    );
}

export default Navbar;
