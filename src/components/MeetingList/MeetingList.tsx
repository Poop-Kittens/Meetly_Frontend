import { getUpcomingMeetings } from "../../api/api";
import { useState, useEffect } from "react";
import type { BasicMeetingResponse } from "../../types/types";
import BasicMeetingCard from "../BasicMeetingCard/BasicMeetingCard";
import "../MeetingList/MeetingList.css";
import { getMyMeetings } from "../../api/api";

interface MeetingListProps {
  onMeetingClick: (id: number) => void;
  mine?: "upcoming" | "past"; // utan värde: alla kommande möten.
}
function MeetingList({ onMeetingClick, mine }: MeetingListProps) {
  const [meetingList, setMeetingList] = useState<BasicMeetingResponse[]>([]);
  const [myMeetingids, setMyMeetingIds] = useState<number[]>([]);
  async function getMeetings() {
    let meetings = await getUpcomingMeetings();
    let myMeetings = await getMyMeetings();
    setMyMeetingIds(myMeetings.map((m) => m.id));

    if (!mine) {
      setMeetingList(meetings);
      return;
    }

    const now = new Date();
    const time = (m: BasicMeetingResponse) => new Date(m.date).getTime();

    if (mine === "upcoming") {
      setMeetingList(
        myMeetings
          .filter((m) => new Date(m.date) >= now)
          .sort((a, b) => time(a) - time(b)),
      );
    } else {
      setMeetingList(
        myMeetings
          .filter((m) => new Date(m.date) < now)
          .sort((a, b) => time(b) - time(a)),
      );
    }
  } //en asynkron funktion som används för att kunna använda api-anropet
  useEffect(() => {
    getMeetings();
  }, [mine]); //useeffect kör getmeetings efter att komponenenten meetinglist har renderats.
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
