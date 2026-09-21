import { useEffect, useMemo, useState } from "react";
import { mergePeople, type Person } from "../../scripts/people-sheet.mjs";
import peopleData from "../content/people.json";
import alumniData from "../content/alumni.json";
import topicData from "../content/topics.json";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1Ji6d41RBSASJ6CPgB0OV_-XoevKH5qxCY_Xt_5u2tbA/gviz/tq?tqx=out:csv&sheet=People";
const REFRESH_MS = 30_000;
const alumni: Person[] = alumniData.map((p) => ({
  ...p,
  role: "Alumni",
  group: "Lab Alumni",
}));

export function usePeople() {
  const [people, setPeople] = useState<Person[]>(peopleData);
  useEffect(() => {
    let stopped = false;
    let inFlight = false;
    let current: Person[] = peopleData;
    let controller: AbortController | undefined;
    const refresh = async () => {
      if (stopped || inFlight || document.hidden) return;
      inFlight = true;
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller?.abort(), 15_000);
      try {
        const response = await fetch(`${SHEET_URL}&_=${Date.now()}`, {
          signal: controller.signal,
          cache: "no-store",
          credentials: "omit",
        });
        if (!response.ok) throw new Error(`Sheet HTTP ${response.status}`);
        const csv = await response.text();
        if (/^\s*</.test(csv))
          throw new Error("Sheet requires public read access");
        const next = mergePeople(current, csv);
        if (!stopped && next.changes.length) {
          current = next.people;
          setPeople(current);
        }
      } catch (error) {
        if (!stopped)
          console.warn(
            "People refresh failed; keeping the last available data.",
            error,
          );
      } finally {
        window.clearTimeout(timeout);
        inFlight = false;
      }
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), REFRESH_MS);
    const resume = () => void refresh();
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("online", resume);
    return () => {
      stopped = true;
      controller?.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("online", resume);
    };
  }, []);
  const allPeople = useMemo(() => [...people, ...alumni], [people]);
  const topics = useMemo(() => {
    const catalog = [...topicData];
    for (const person of allPeople) {
      for (const id of person.topics) {
        if (!catalog.some((topic) => topic.id === id))
          catalog.push({ id, label: id });
      }
    }
    return catalog;
  }, [allPeople]);
  return { allPeople, topics };
}
