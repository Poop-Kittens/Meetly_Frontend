import "../Navbar/Navbar.css";
import { useUser } from "../../context/userContext";
import { useNavigate } from "react-router";

interface NavbarProps {
    activePage: string;
}

function Navbar({ activePage }: NavbarProps) {
    const navigate = useNavigate();
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
            {activePage != "HomePage" && (
                <button className="NavButton" onClick={() => navigate(-1)}>
                    Go back
                </button>
            )}
            <div className="UserNameSection">
                <h2 className="UserName">{username}</h2>
                <p className="NameTag">{userTag}</p>
            </div>
        </div>
    );
}

export default Navbar;
