import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { getUpcomingMeetings, searchMeetings, getMeeting } from "../../api/api";
import { Navigate } from "react-router";
import { useUser } from "../../hooks/useUser";
import { useMyMeetings } from "../../hooks/useMyMeetings";
import type {
  BasicMeetingResponse,
  MeetingResponse,
  MeetingSearchRequest,
} from "../../types/types";

import SearchForm from "../../components/SearchForm/SearchForm";
import MeetingList from "../../components/MeetingList/MeetingList";
import MeetingCard from "../../components/MeetingCard/MeetingCard";
import MessageBox from "../../components/MessageBox/MessageBox";

function Home() {
  const { user, loading } = useUser();
  const { myMeetings, refresh: refreshMyMeetings } = useMyMeetings(); // above the early returns
  const [lastRequest, setLastRequest] = useState<MeetingSearchRequest | null>(
    null,
  );

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

  const handleMeetingSearch = async (request: MeetingSearchRequest) => {
    try {
      setError(null);
      setLastRequest(request);
      setMeetings(await searchMeetings(request));
    } catch (error) {
      console.error("Sökningen misslyckades:", error);
      setError("Sökningen misslyckades");
    }
  };

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

  const handleAttendanceChange = async () => {
    try {
      const [updated] = await Promise.all([
        lastRequest ? searchMeetings(lastRequest) : getUpcomingMeetings(),
        refreshMyMeetings(),
      ]);
      setMeetings(updated);
    } catch (error) {
      console.error("Kunde inte uppdatera listan:", error);
      setError("Kunde inte uppdatera listan.");
    }
  };

  return (
    <div>
      <Navbar activePage="HomePage" />
      <h1>Homepage</h1>
      <SearchForm onSearch={handleMeetingSearch} />
      {!isLoading && !error && meetings.length === 0 && (
        <MessageBox
          message="Det finns inga kommande möten just nu."
          messageType="warning"
        />
      )}
      {isLoading && <MessageBox message="Hämtar möten..." messageType="none" />}
      {error && <MessageBox message={error} messageType="error" />}
      <MeetingList
        meetings={meetings}
        myMeetingIds={myMeetings.map((m) => m.id)}
        onMeetingClick={handleMeetingClick}
        onAttendanceChange={handleAttendanceChange}
      />

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
