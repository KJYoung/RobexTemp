export type Research = { title: string; description: string; url?: string };
export type Person = {
  id: string;
  name: string;
  role: string;
  group: string;
  image?: string;
  email?: string;
  url?: string; // Legacy Alumni field
  linkedin?: string;
  homepage?: string;
  note?: string;
  destination?: string;
  topics: string[];
  fullBio: string;
  researches: Research[];
};
export function parseCSV(text: string): string[][];
export function mergePeople(
  existing: Person[],
  csv: string,
): {
  people: Person[];
  matched: number;
  changes: string[];
};

export function sheetText(value: string): string;
