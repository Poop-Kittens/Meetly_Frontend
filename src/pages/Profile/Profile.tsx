import { useEffect, useState } from "react";
import { ApiError, getCurrentUser, getMyMeetings } from "../../api/Api";
import UserCard from "../../components/UserCard/UserCard";
import type { BasicMeetingResponse, UserResponse } from "../../types/types";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [meetings, setMeetings] = useState<BasicMeetingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getCurrentUser(), getMyMeetings()])
      .then(([u, m]) => {
        setUser(u);
        setMeetings(m);
      })
      .catch((err) => {
        setError(
          err instanceof ApiError && err.status === 401
            ? "Du måste logga in för att se din profil."
            : "Kunde inte hämta profilen.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Laddar...</p>;
  if (error || !user) return <p role="alert">{error ?? "Något gick fel."}</p>;

  return (
    <main className="profile">
      <UserCard user={user} />
    </main>
  );
}

export default Profile;
