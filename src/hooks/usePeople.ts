import { useMemo } from "react";
import { mergePeople, type Person } from "../../scripts/people-sheet.mjs";
import peopleData from "../content/people.json";
import alumniData from "../content/alumni.json";
import { useSheet } from "./useSheet";
import { mergeAlumni } from "../../scripts/content-sheets.mjs";
import topicData from "../content/topics.json";

const mergeCurrentPeople = (current: Person[], csv: string) =>
  mergePeople(current, csv).people;
export function usePeople() {
  const people = useSheet<Person[]>("People", peopleData, mergeCurrentPeople);
  const alumni = useSheet("Alumni", alumniData, mergeAlumni);
  const allPeople = useMemo(
    () => [
      ...people,
      ...alumni.map((p) => ({
        ...p,
        role: "Alumni",
        group: "Lab Alumni",
        fullBio: "",
        researches: [],
      })),
    ],
    [people, alumni],
  );
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
