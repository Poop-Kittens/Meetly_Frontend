import { useEffect, useState } from "react";
import { ApiError, getCurrentUser, getMyMeetings } from "../../api/Api";
import UserCard from "../../components/UserCard/UserCard";
import type { UserResponse } from "../../types/types";
import "./Profile.css";
import Navbar from "../../components/Navbar/Navbar";

function Profile() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        setUser(await getCurrentUser());
      } catch (e) {
        console.error(e);
        setError(e instanceof ApiError ? e.message : "Något gick fel.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p>Laddar...</p>;
  }
  if (error || !user) {
    return <p>{error ?? "Något gick fel."}</p>;
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
