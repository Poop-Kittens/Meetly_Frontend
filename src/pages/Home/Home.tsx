import Navbar from "../../components/Navbar/Navbar";
import MeetingCard from "../../components/MeetingCard/MeetingCard";
import { useState, useEffect } from "react";
import { getUpcomingMeetings, getMeeting } from "../../api/api";
import type { BasicMeetingResponse, MeetingResponse } from "../../types/types";

function Home() {
    //håller koll på om rutan med detaljerna ska visas
    const [isMeetingOpen, setIsMeetingOpen] = useState(false);

    //sparar listan med kommande möten som hämtas från backend
    const [meetings, setMeetings] = useState<BasicMeetingResponse[]>([]);

    //sparar det möte som användaren klickat på, eller null om inget är valt
    const [selectedMeeting, setSelectedMeeting] = useState<MeetingResponse | null>(null);

    //håller reda på om möteslistan fortfarande hämtas
    const [isLoading, setIsLoading] = useState(true);

    //sparar felmeddelande om något får fel vid hämtningen
    const [error, setError] = useState<string | null>(null);

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

    //körs när Home-komponenten laddas första gången
    useEffect(() => {
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
    }, []);

    return (
        <div>
            <Navbar activePage="HomePage" />
            <h1>Homepage</h1>
            {isLoading && <p>Hämtar möten...</p>}
            {error && <p>{error}</p>}
            {!isLoading && !error && meetings.length === 0 && (
                <p>Det finns inga kommande möten just nu.</p>
            )}

            {/* Tillfällig testknapp som öppnar det första mötet i listan */}
            <button
                onClick={() => {
                    if (meetings[0]?.id != null) {
                        handleMeetingClick(meetings[0].id);
                    }
                }}
            >
                Visa första mötet
            </button>

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
