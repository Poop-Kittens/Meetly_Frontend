import { useState, useEffect, useCallback } from "react";
import { getMyMeetings } from "../api/api";
import type { BasicMeetingResponse } from "../types/types";

export function useMyMeetings() {
  const [myMeetings, setMyMeetings] = useState<BasicMeetingResponse[]>([]);

  const refresh = useCallback(async () => {
    try {
      setMyMeetings(await getMyMeetings());
    } catch (e) {
      console.error("Kunde inte hämta mina möten:", e);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { myMeetings, refresh };
}
