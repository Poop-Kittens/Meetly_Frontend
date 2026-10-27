import type { BasicMeetingResponse } from "../../types/types";
import "./MeetingList.css";

import BasicMeetingCard from "../BasicMeetingCard/BasicMeetingCard";

interface MeetingListProps {
    meetings: BasicMeetingResponse[];
    myMeetingIds: number[];
    onMeetingClick: (id: number) => void;
    onReviewClick?: (id: number) => void;
    onAttendanceChange: () => void;
}

function MeetingList({
    meetings,
    myMeetingIds,
    onMeetingClick,
    onReviewClick,
    onAttendanceChange,
}: MeetingListProps) {
    return (
        <div className="meetingList">
            {meetings.map((meeting) => (
                <BasicMeetingCard
                    key={meeting.id}
                    id={meeting.id}
                    title={meeting.title ?? ""}
                    date={meeting.date}
                    location={meeting.location}
                    remainingSlots={meeting.remainingSlots}
                    categories={meeting.categories}
                    isAttending={myMeetingIds.includes(meeting.id)}
                    onMeetingClick={onMeetingClick}
                    onAttendanceChange={onAttendanceChange}
                    onReviewClick={onReviewClick}
                />
            ))}
        </div>
    );
}

export default MeetingList;
