import { getUpcomingMeetings } from "../../api/api";
import { useState, useEffect } from "react";
import type { BasicMeetingResponse } from "../../types/types";
import BasicMeetingCard from "../BasicMeetingCard/BasicMeetingCard";
import "../MeetingList/MeetingList.css";
import { getMyMeetings } from "../../api/api";

interface MeetingListProps {
    onMeetingClick: (id: number) => void;
}
function MeetingList({ onMeetingClick }: MeetingListProps) {
    const [meetingList, setMeetingList] = useState<BasicMeetingResponse[]>([]);
    const [myMeetingids, setMyMeetingIds] = useState<number[]>([]);
    async function getMeetings() {
        let meetings = await getUpcomingMeetings();
        let myMeetings = await getMyMeetings();
        setMyMeetingIds(myMeetings.map((m) => m.id));

        setMeetingList(meetings);
    } //en asynkron funktion som används för att kunna använda api-anropet
    useEffect(() => {
        getMeetings();
    }, []); //useeffect kör getmeetings efter att komponenenten meetinglist har renderats.
    console.log(meetingList);
    return (
        <div className="meetingList">
            {meetingList.map((meeting) => (
                <BasicMeetingCard
                    key={meeting.id}
                    id={meeting.id}
                    title={meeting.title ?? ""}
                    date={meeting.date}
                    location={meeting.location}
                    remainingSlots={meeting.remainingSlots}
                    categories={meeting.categories}
                    isAttending={myMeetingids.includes(meeting.id)} //skickar med en bool om användaren är anmäld redan eller ej
                    onMeetingClick={onMeetingClick}
                    onAttendanceChange={getMeetings}
                />
            ))}
        </div>
    );
}

export default MeetingList;
