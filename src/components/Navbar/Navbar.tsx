import "../Navbar/Navbar.css";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router";

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
      {activePage != "HomePage" && (
        <Link className="NavButton" to="/home">
          Go back
        </Link>
      )}
      <div className="UserNameSection">
        <h2 className="UserName">{username}</h2>
        <Link className="user-link" to="/profile">
          <p className="NameTag">{userTag}</p>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
