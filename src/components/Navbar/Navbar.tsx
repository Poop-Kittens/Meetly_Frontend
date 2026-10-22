import "../Navbar/Navbar.css";
function Navbar({
    ActivePage,
    ActiveUser,
}: {
    ActivePage: string;
    ActiveUser: string;
}) {
    const userTag = ActiveUser.trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((name) => name.charAt(0).toUpperCase())
        .join("");

    return (
        <div className="navbar">
            <h2>Meetly</h2>
            {ActivePage != "HomePage" && <a className="NavButton">Go back</a>}
            <div className="UserNameSection">
                <h2 className="UserName">{ActiveUser}</h2>
                <p className="NameTag">{userTag}</p>
            </div>
        </div>
    );
}

export default Navbar;
