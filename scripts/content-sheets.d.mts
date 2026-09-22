export type News = {
  id: string;
  date: string;
  type: string;
  title: string;
  text: string;
  tldr?: string;
  url?: string;
};
export type Alumni = {
  id: string;
  name: string;
  destination: string;
  url: string;
  topics: string[];
  image?: string;
  note?: string;
};
export function mergeNews(existing: News[], csv: string): News[];
export function mergeAlumni(existing: Alumni[], csv: string): Alumni[];

export function sortNews(items: News[]): News[];
