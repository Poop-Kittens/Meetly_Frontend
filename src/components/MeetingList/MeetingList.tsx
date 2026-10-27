import type { BasicMeetingResponse } from "../../types/types";
import "./MeetingList.css";

import BasicMeetingCard from "../BasicMeetingCard/BasicMeetingCard";

interface MeetingListProps {
  meetings: BasicMeetingResponse[];
  myMeetingIds: number[];
  onMeetingClick: (id: number) => void;
  onAttendanceChange: () => void;
}

function MeetingList({
  meetings,
  myMeetingIds,
  onMeetingClick,
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
        />
      ))}
    </div>
  );
}

export default MeetingList;
