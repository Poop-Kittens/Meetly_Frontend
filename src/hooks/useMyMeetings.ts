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
    let cancelled = false;

    async function loadMeetings() {
      try {
        const meetings = await getMyMeetings();

        if (!cancelled) {
          setMyMeetings(meetings);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Kunde inte hämta mina möten:", e);
        }
      }
    }

    void loadMeetings();

    return () => {
      cancelled = true;
    };
  }, []);

  return { myMeetings, refresh };
}