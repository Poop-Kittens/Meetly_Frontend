import "../BasicMeetingCard/BasicMeetingCard.css";
import CardDate from "../CardDate/CardDate";
import { signUp, cancelRegistration } from "../../api/api";

interface BasicMeetingCardProps {
    id: number;
    date: string;
    categories: string[];
    title: string;
    location: string;
    remainingSlots: number;
    onMeetingClick: (id: number) => void;
    isAttending: boolean;
    onAttendanceChange: () => void; //Detta blir en callbackfunktion som alltså kör den riktiga funktionen i meetinglist
    onReviewClick?: (id: number) => void; //Valfri, Home behöver den inte.
}

function BasicMeetingCard({
    id,
    date,
    categories,
    title,
    location,
    remainingSlots,
    onMeetingClick,
    isAttending,
    onAttendanceChange,
    onReviewClick,
}: BasicMeetingCardProps) {
    const meetingtime = new Date(date).toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const isPrevious = new Date(date) < new Date(); //Mötet klart när datum passerat.

    return (
        <div
            className={`meetingCard ${isPrevious ? "meetingCard-previous" : ""}`}
            onClick={() => onMeetingClick(id)}
        >
            <CardDate date={date} />
            <div className="meetingHeading">
                <h1 className="title">{title}</h1>
                <div className="categoryList">
                    {categories.map((category) => (
                        <span key={category} className="categoryChip">
                            {category}
                        </span>
                    ))}
                </div>
            </div>
            <div className="timedisplay">
                <p>{meetingtime}</p>
            </div>
            <p className="locationDisplay">{location}</p>
            {!isPrevious && (
                <p className="remainingSpotsDisplay">
                    Lediga platser: {remainingSlots}
                </p>
            )}

            {isPrevious ? (
                isAttending && (
                    <button
                        className="attend review"
                        onClick={(e) => {
                            e.stopPropagation();
                            onReviewClick?.(id);
                        }}
                    >
                        Review
                    </button>
                )
            ) : !isAttending ? (
                <button
                    disabled={remainingSlots <= 0}
                    className="attend"
                    onClick={async (e) => {
                        e.stopPropagation();
                        try {
                            await signUp(id);
                            onAttendanceChange();
                        } catch (error) {
                            console.log("Något gick fel", error);
                        }
                    }}
                >
                    Anmäl till möte
                </button>
            ) : (
                <button
                    className="attend cancel"
                    onClick={async (e) => {
                        e.stopPropagation();
                        try {
                            await cancelRegistration(id);
                            onAttendanceChange();
                        } catch (error) {
                            console.log("något gick fel", error);
                        }
                    }}
                >
                    Avanmäl
                </button>
            )}
        </div>
    );
}

export default BasicMeetingCard;
