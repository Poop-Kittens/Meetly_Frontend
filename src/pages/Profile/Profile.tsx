import UserCard from "../../components/UserCard/UserCard";
import { Navigate } from "react-router";
import "./Profile.css";
import Navbar from "../../components/Navbar/Navbar";
import { useUser } from "../../context/UserContext";

function Profile() {
  const { user, loading } = useUser();

  if (loading) {
    return <p>Laddar...</p>;
  }

  // Navigerar tillbaka till login sidan om det inte finns någon användare
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="profile">
      <Navbar activePage="profile" />
      <h1>My pages</h1>
      <p>A little space for everything you´re part of.</p>
      <UserCard user={user} />
    </main>
  );
}

export default Profile;
