import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { getUpcomingMeetings, getMeeting } from "../../api/api";
import { Navigate } from "react-router";
import { useUser } from "../../hooks/useUser";
import type { BasicMeetingResponse, MeetingResponse } from "../../types/types";

import MeetingList from "../../components/MeetingList/MeetingList";
import MeetingCard from "../../components/MeetingCard/MeetingCard";
import MessageBox from "../../components/MessageBox/MessageBox";

function Home() {
    const { user, loading } = useUser();

    //håller koll på om rutan med detaljerna ska visas
    const [isMeetingOpen, setIsMeetingOpen] = useState(false);

    //sparar listan med kommande möten som hämtas från backend
    const [meetings, setMeetings] = useState<BasicMeetingResponse[]>([]);

    //sparar det möte som användaren klickat på, eller null om inget är valt
    const [selectedMeeting, setSelectedMeeting] =
        useState<MeetingResponse | null>(null);

    //håller reda på om möteslistan fortfarande hämtas
    const [isLoading, setIsLoading] = useState(true);

    //sparar felmeddelande om något får fel vid hämtningen
    const [error, setError] = useState<string | null>(null);

    //körs när Home-komponenten laddas första gången
    useEffect(() => {
        //stoppar hämtningen tills programmet vet att det finns en inloggad användare
        if (loading || !user) {
            return;
        }

        //hämtar listan med kommande möten från backend
        getUpcomingMeetings()
            .then((data) => {
                //sparar möteslistan i state
                setMeetings(data);
            })
            .catch((error) => {
                //fångar fel om möteslistan inte kan hämtas
                console.error("Kunde inte hämta möten:", error);
                setError("Kunde inte hämta möten. Försök igen senare.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [user, loading]);

    console.log("Möten från API:", meetings);

    //väntar på att användaren ska laddas in
    if (loading) {
        return <MessageBox message="Laddar användare..." messageType="none" />;
    }

    //navigerar tillbaka till login sidan om det inte finns någon användare
    if (!user) {
        return <Navigate to="/" replace />;
    }

    //hanterar detaljerna för det möte användaren klickar på
    const handleMeetingClick = async (id: number) => {
        try {
            //anropar backend och väntar på mötets information
            const meeting = await getMeeting(id);
            //sparar det valda mötet och öppnar rutan med detaljer
            setSelectedMeeting(meeting);
            setIsMeetingOpen(true);
        } catch (error) {
            //fångar fel om mötet inte kan hämtas
            console.error("Kunde inte hämta mötet:", error);
            setError("Kunde inte öppna mötet. Försök igen senare.");
        }
    };

    return (
        <div>
            <Navbar activePage="HomePage" />
            <h1>Kommande Meetups</h1>
            <MeetingList onMeetingClick={handleMeetingClick} />
            {isLoading && (
                <MessageBox message="Hämtar möten..." messageType="none" />
            )}
            {error && <MessageBox message={error} messageType="error" />}
            {!isLoading && !error && meetings.length === 0 && (
                <MessageBox
                    message="Det finns inga kommande möten just nu."
                    messageType="warning"
                />
            )}

            {isMeetingOpen && selectedMeeting && (
                <MeetingCard
                    meeting={selectedMeeting}
                    onClose={() => {
                        setIsMeetingOpen(false);
                        setSelectedMeeting(null);
                    }}
                />
            )}
        </div>
    );
}

export default Home;
