//importerar typen som beskriver vilken info ett möte innehåller
import type { MeetingResponse } from "../../types/types";
import "./MeetingCard.css";

//definierar vilka props MetingCard måste få från sin föräldrakomponent
type MeetingCardProps = {
    meeting: MeetingResponse;
    onClose: () => void;
};

//tar emot mötesinfon och funktionen för att stänga rutan
function MeetingCard({ meeting, onClose }: MeetingCardProps) {
    return (
        <div className="meeting-overlay" onClick={onClose}>
            <div className="meeting-card" onClick={(e) => e.stopPropagation()}>
                <div className="meeting-modal-header">
                    <h3>{meeting.title}</h3>

                    <button
                        type="button"
                        className="meeting-close"
                        onClick={onClose}
                        aria-label="Stäng mötesdetaljer"
                    >
                        ✕
                    </button>
                </div>
                <div className="meeting-details-layout">
                    <div className="meeting-information">
                        <h4>Om meetupen</h4>
                        <p>
                            📅{" "}
                            {meeting.date
                                ? new Date(meeting.date).toLocaleString(
                                      "sv-SE",
                                      {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      },
                                  )
                                : "Datum saknas"}
                        </p>

                        <p>📍 {meeting.location}</p>
                        <p>👥 Lediga platser: {meeting.remainingSlots}</p>
                        <p>👤 Arrangör: {meeting.host?.userName}</p>

                        <p className="meeting-description">
                            {meeting.description}
                        </p>
                        <div className="meeting-categories">
                            {meeting.categories?.map((category) => (
                                <span className="categoryChip" key={category}>
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="meeting-reviews">
                        <h4>Recensioner</h4>
                        <p>Här kommer recensionerna att visas.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MeetingCard;
