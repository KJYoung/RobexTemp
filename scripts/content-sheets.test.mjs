import test from "node:test";
import assert from "node:assert/strict";
import { mergeNews, mergeAlumni } from "./content-sheets.mjs";
test("News matches IDs, preserves blanks, includes new items, skips drafts in descending ID order", () => {
  const existing = [
    {
      id: "1",
      date: "2025",
      type: "award",
      title: "Old",
      text: "Original",
      url: "https://example.com",
    },
  ];
  const result = mergeNews(
    existing,
    "id,date,type,title,text,url (optional)\n2,2026,team,New,Hello,\n1,,,Updated,,\n3,,,,,",
  );
  assert.deepEqual(
    result.map((n) => n.id),
    ["2", "1"],
  );
  assert.equal(result[1].text, "Original");
  assert.equal(result[1].url, "https://example.com");
  assert.equal(result[0].url, undefined);
  assert.equal(existing[0].title, "Old");
});
test("News rejects duplicate IDs, wrong sheet headers, unsafe links", () => {
  assert.throws(() =>
    mergeNews([], "id,date,type,title,text,url\n1,,,A,,\n1,,,B,,"),
  );
  assert.throws(() => mergeNews([], "name\nSomebody"));
  assert.throws(() =>
    mergeNews([], "id,date,type,title,text,url\n1,,,A,,javascript:alert(1)"),
  );
});
test("Alumni merges by name and adds new alumni without biography fields", () => {
  const existing = [
    {
      id: "tim",
      name: "Tim",
      destination: "Old",
      url: "",
      topics: ["topic-1"],
    },
  ];
  const result = mergeAlumni(
    existing,
    "name,destination,url,image,note,id,topics\n tim ,New,,,,,\nAlex,Lab,,,,alex,topic-2",
  );
  assert.equal(result[0].destination, "New");
  assert.deepEqual(result[0].topics, ["topic-1"]);
  assert.equal(result[1].id, "alex");
  assert.equal(result[1].fullBio, undefined);
  assert.equal(existing[0].destination, "Old");
  assert.throws(() => mergeAlumni(existing, "name,id\nAlex,tim"));
});

test("News sorts numeric IDs descending and preserves plain date strings", () => {
  const result = mergeNews(
    [],
    "id,date,type,title,text\n2,Fall 2026,team,Second,Text\n10,03/04/2026,team,Tenth,Text\n9,Spring — launch,team,Ninth,Text",
  );
  assert.deepEqual(
    result.map((n) => n.id),
    ["10", "9", "2"],
  );
  assert.deepEqual(
    result.map((n) => n.date),
    ["03/04/2026", "Spring — launch", "Fall 2026"],
  );
});

test("literal line breaks in News and Alumni text become real newlines", () => {
  const news = mergeNews(
    [],
    String.raw`id,date,type,title,text,url
1,2026\nSpring,team,First\nSecond,Line one \n Line two,https://example.com`,
  );
  assert.equal(news[0].date, "2026\nSpring");
  assert.equal(news[0].title, "First\nSecond");
  assert.equal(news[0].text, "Line one \n Line two");
  const alumni = mergeAlumni(
    [],
    String.raw`name,id,destination,note
Jane,jane,Lab\nCompany,One\nTwo`,
  );
  assert.equal(alumni[0].destination, "Lab\nCompany");
  assert.equal(alumni[0].note, "One\nTwo");
});

test("News imports optional tldr, decodes line breaks and preserves blank fallback", () => {
  const csv = String.raw`id,date,type,title,text,tldr
1,2026,team,Full title,Full story,Short\nSummary`;
  const result = mergeNews([], csv);
  assert.equal(result[0].title, "Full title");
  assert.equal(result[0].text, "Full story");
  assert.equal(result[0].tldr, "Short\nSummary");
  assert.equal(
    mergeNews(result, "id,date,type,title,text,tldr\n1,,,,,")[0].tldr,
    "Short\nSummary",
  );
  assert.equal(
    mergeNews([], "id,date,type,title,text\n2,,,Title,Story")[0].tldr,
    "",
  );
});
