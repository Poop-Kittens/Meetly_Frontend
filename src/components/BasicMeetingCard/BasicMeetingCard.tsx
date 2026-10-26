import "../BasicMeetingCard/BasicMeetingCard.css";
import CardDate from "../CardDate/CardDate";
import { signUp } from "../../api/api";
import { useState } from "react";
import { cancelRegistration } from "../../api/api";

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
            {!isAttending ? (
                <button
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
