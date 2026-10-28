import "../BasicMeetingCard/BasicMeetingCard.css";
import CardDate from "../CardDate/CardDate";
import { signUp, cancelRegistration } from "../../api/api";
import type { MouseEvent } from "react";

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

    const runAndRefresh = async (action: () => Promise<unknown>) => {
        try {
            await action();
            onAttendanceChange();
        } catch (error) {
            console.error("Något gick fel", error);
        }
    };

    const handleAttend = (e: MouseEvent) => {
        e.stopPropagation();
        runAndRefresh(() => signUp(id));
    };

    const handleCancel = (e: MouseEvent) => {
        e.stopPropagation();
        runAndRefresh(() => cancelRegistration(id));
    };

    const handleReview = (e: MouseEvent) => {
        e.stopPropagation();
        onReviewClick?.(id);
    };

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
                    <button className="attend review" onClick={handleReview}>
                        Recensera
                    </button>
                )
            ) : isAttending ? (
                <button className="attend cancel" onClick={handleCancel}>
                    Avanmäl
                </button>
            ) : (
                <button
                    disabled={remainingSlots <= 0}
                    className="attend"
                    onClick={handleAttend}
                >
                    Anmäl till möte
                </button>
            )}
        </div>
    );
}

export default BasicMeetingCard;
