import "../BasicMeetingCard/BasicMeetingCard.css";
import CardDate from "../CardDate/CardDate";
import { signUp } from "../../api/api";

interface BasicMeetingCardProps {
    id: number;
    date: string;
    categories: string[];
    title: string;
    location: string;
    remainingSlots: number;
    onMeetingClick: (id: number) => void;
}

function BasicMeetingCard({
    id,
    date,
    categories,
    title,
    location,
    remainingSlots,
    onMeetingClick,
}: BasicMeetingCardProps) {
    let meetingtime = new Date(date);

    return (
        <div className="meetingCard" onClick={() => onMeetingClick(id)}>
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
                <p>
                    {meetingtime.toLocaleTimeString("sv-SE", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
            <p className="locationDisplay">{location}</p>
            <p className="remainingSpotsDisplay">
                Lediga platser:{remainingSlots}
            </p>
            <button
                className="attend"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log("ANMÄL-KNAPP KLICKAD", id);
                    signUp(id);
                }}
            >
                Anmäl till möte
            </button>
        </div>
    );
}

export default BasicMeetingCard;
