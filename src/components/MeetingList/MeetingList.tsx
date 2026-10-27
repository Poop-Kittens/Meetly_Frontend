import { useState, useEffect } from "react";
import { getUpcomingMeetings, getMyMeetings } from "../../api/api";
import type { BasicMeetingResponse } from "../../types/types";
import "../MeetingList/MeetingList.css";

import BasicMeetingCard from "../BasicMeetingCard/BasicMeetingCard";

interface MeetingListProps {
  onMeetingClick: (id: number) => void;
  mine?: "upcoming" | "past"; // utan värde: alla kommande möten.
}

function MeetingList({ onMeetingClick, mine }: MeetingListProps) {
  const [meetingList, setMeetingList] = useState<BasicMeetingResponse[]>([]);
  const [myMeetingids, setMyMeetingIds] = useState<number[]>([]);
  // ändrar key variabeln i BasicMeetingCard som gör att den renderas igen med de nya detaljerna
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadMeetings() {
      const [meetings, myMeetings] = await Promise.all([
        getUpcomingMeetings(),
        getMyMeetings(),
      ]);

      if (cancelled) {
        return;
      }

      setMyMeetingIds(myMeetings.map((m) => m.id));

      if (!mine) {
        setMeetingList(meetings);
        return;
      }

      const now = new Date();
      const time = (m: BasicMeetingResponse) => {
        return new Date(m.date).getTime();
      };

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
    }

    loadMeetings();

    return () => {
      cancelled = true;
    };
  }, [mine, refreshKey]);

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
          onAttendanceChange={() => setRefreshKey((k) => k + 1)}
        />
      ))}
    </div>
  );
}

export default MeetingList;
