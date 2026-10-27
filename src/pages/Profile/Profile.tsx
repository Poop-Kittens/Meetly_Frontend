import { useState } from "react";
import { Navigate } from "react-router";
import { useUser } from "../../hooks/useUser";
import { useMyMeetings } from "../../hooks/useMyMeetings";
import type { MeetingResponse, BasicMeetingResponse } from "../../types/types";
import { getMeeting } from "../../api/api";
import "./Profile.css";

import Navbar from "../../components/Navbar/Navbar";
import MessageBox from "../../components/MessageBox/MessageBox";
import MeetingList from "../../components/MeetingList/MeetingList";
import MeetingCard from "../../components/MeetingCard/MeetingCard";
import ReviewForm from "../../components/ReviewForm/ReviewForm";
import Footer from "../../components/Footer/Footer";

function Profile() {
    const { user, loading } = useUser();
    const { myMeetings, refresh } = useMyMeetings();
    const [selectedMeeting, setSelectedMeeting] =
        useState<MeetingResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reviewingId, setReviewingId] = useState<number | null>(null);

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
        <div className="profile-page">
            <Navbar activePage="profile" />

            <main className="profile-main">
                <header className="profile-header">
                    <h1>Mina sidor</h1>
                    <p>En liten samling av dina saker och ting</p>
                </header>

                {upcoming.length > 0 ? (
                    <>
                        <h2 className="profile-heading">Kommande meetups</h2>
                        <MeetingList
                            meetings={upcoming}
                            myMeetingIds={myMeetingIds}
                            onMeetingClick={handleMeetingClick}
                            onAttendanceChange={refresh}
                        />
                    </>
                ) : (
                    <h2 className="profile-heading">
                        Du har inga kommande meetups
                    </h2>
                )}

                {past.length > 0 && (
                    <>
                        <h2 className="profile-heading">Tidigare meetups</h2>
                        <MeetingList
                            meetings={past}
                            myMeetingIds={myMeetingIds}
                            onMeetingClick={handleMeetingClick}
                            onReviewClick={setReviewingId}
                            onAttendanceChange={refresh}
                        />
                    </>
                )}

                {error && <MessageBox message={error} messageType="error" />}
            </main>

            {selectedMeeting && (
                <MeetingCard
                    meeting={selectedMeeting}
                    onClose={() => setSelectedMeeting(null)}
                />
            )}

            {reviewingId !== null && (
                <ReviewForm
                    meetingId={reviewingId}
                    onClose={() => setReviewingId(null)}
                />
            )}

            <Footer />
        </div>
    );
}

export default Profile;
