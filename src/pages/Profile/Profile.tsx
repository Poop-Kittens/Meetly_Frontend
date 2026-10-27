import { useState } from "react";
import { Navigate } from "react-router";
import { useUser } from "../../hooks/useUser";
import { useMyMeetings } from "../../hooks/useMyMeetings";
import type { MeetingResponse, BasicMeetingResponse } from "../../types/types";
import { getMeeting } from "../../api/api";
import "./Profile.css";

import UserCard from "../../components/UserCard/UserCard";
import Navbar from "../../components/Navbar/Navbar";
import MessageBox from "../../components/MessageBox/MessageBox";
import MeetingList from "../../components/MeetingList/MeetingList";
import MeetingCard from "../../components/MeetingCard/MeetingCard";

function Profile() {
  const { user, loading } = useUser();
  const { myMeetings, refresh } = useMyMeetings();
  const [selectedMeeting, setSelectedMeeting] =
    useState<MeetingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <MessageBox message="Laddar användare..." messageType="none" />;
  }

  // Navigerar tillbaka till login sidan om det inte finns någon användare
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const myMeetingIds = myMeetings.map((m) => m.id);
  const now = new Date();
  const time = (m: BasicMeetingResponse) => new Date(m.date).getTime();

  const upcoming = myMeetings
    .filter((m) => new Date(m.date) >= now)
    .sort((a, b) => time(a) - time(b));

  const past = myMeetings
    .filter((m) => new Date(m.date) < now)
    .sort((a, b) => time(b) - time(a));

  const handleMeetingClick = async (id: number) => {
    try {
      setError(null);
      setSelectedMeeting(await getMeeting(id));
    } catch (e) {
      console.error("Kunde inte hämta mötet:", e);
      setError("Kunde inte öppna mötet. Försök igen senare.");
    }
  };

  return (
    <main className="profile">
      <Navbar activePage="profile" />
      <div className="profilePage">
        <section className="profilePage-left">
          <h1>My pages</h1>
          <p>A little space for everything you´re part of.</p>
          <div className="profileMeetings">
            <h2>Upcoming:</h2>
            <MeetingList
              meetings={upcoming}
              myMeetingIds={myMeetingIds}
              onMeetingClick={handleMeetingClick}
              onAttendanceChange={refresh}
            />

            <h2>Previous:</h2>
            <MeetingList
              meetings={past}
              myMeetingIds={myMeetingIds}
              onMeetingClick={handleMeetingClick}
              onAttendanceChange={refresh}
            />

            {error && <MessageBox message={error} messageType="error" />}

            {selectedMeeting && (
              <MeetingCard
                meeting={selectedMeeting}
                onClose={() => setSelectedMeeting(null)}
              />
            )}
          </div>
        </section>
        <section className="profilePage-right">
          <UserCard user={user} />
        </section>
      </div>
    </main>
  );
}

export default Profile;
