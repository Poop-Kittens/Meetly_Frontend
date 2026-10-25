import { getUpcomingMeetings } from "../../api/api";
import { useState, useEffect } from "react";
import type { BasicMeetingResponse } from "../../types/types";
import BasicMeetingCard from "../BasicMeetingCard/BasicMeetingCard";
import "../MeetingList/MeetingList.css";

interface MeetingListProps {
    onMeetingClick: (id: number) => void;
}
function MeetingList({ onMeetingClick }: MeetingListProps) {
    const [meetingList, setMeetingList] = useState<BasicMeetingResponse[]>([]);
    async function getMeetings() {
        let meetings = await getUpcomingMeetings();
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
                    onMeetingClick={onMeetingClick}
                />
            ))}
        </div>
    );
}

export default MeetingList;
