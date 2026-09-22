import test from "node:test";
import assert from "node:assert/strict";
import { parseCSV, mergePeople } from "./people-sheet.mjs";
const base = [
  {
    name: "Jane Doe",
    id: "jane-doe",
    group: "PhD Students",
    email: "old",
    note: "Keep",
    topics: ["old"],
    fullBio: "Original",
    researches: [{ title: "Title", description: "Original description" }],
  },
];
test("CSV handles escaped quotes, commas and multiline cells", () =>
  assert.deepEqual(parseCSV('name,fullBio\r\nJane,"a,b\n""quoted"""'), [
    ["name", "fullBio"],
    ["Jane", 'a,b\n"quoted"'],
  ]));
test("name matching, blanks preserve data, zero is nonempty, input not mutated", () => {
  const r = mergePeople(
    base,
    'name,note,email,fullBio\n jane DOE ,,0,"New bio"',
  );
  assert.equal(r.people[0].note, "Keep");
  assert.equal(r.people[0].email, "0");
  assert.equal(r.people[0].fullBio, "New bio");
  assert.equal(base[0].fullBio, "Original");
});
test("numbered research columns merge field by field", () => {
  const r = mergePeople(base, "name,res-1-title,res-1-desc\nJane Doe,,New");
  assert.deepEqual(r.people[0].researches, [
    { title: "Title", description: "New" },
  ]);
});
test("topics list and email obfuscation", () => {
  const r = mergePeople(
    base,
    'name,topics,email\nJane Doe,"SLAM, Marine robotics",jane@umich.edu',
  );
  assert.deepEqual(r.people[0].topics, ["SLAM", "Marine robotics"]);
  assert.equal(r.people[0].email, "jane (at) umich (dot) edu");
});
test("missing people stay intact", () =>
  assert.equal(
    mergePeople(
      [...base, { ...base[0], name: "Other", id: "other" }],
      "name,note\nJane Doe,New",
    ).people[1].note,
    "Keep",
  ));
test("invalid sheets fail before writing", () => {
  for (const csv of [
    "name,note\nJane Doe,A\nJane Doe,B",
    "name,note\nUnknown,A",
    "name,badField\nJane Doe,A",
    "name\n",
    "name,researches\nJane Doe,nope",
  ])
    assert.throws(() => mergePeople(base, csv));
});

test("person links support separate fields and legacy url without overriding explicit fields", () => {
  const csv =
    "name,url,linkedin,homepage\nJane Doe,https://www.linkedin.com/in/old,https://www.linkedin.com/in/new,https://example.com";
  const person = mergePeople(base, csv).people[0];
  assert.equal(person.linkedin, "https://www.linkedin.com/in/new");
  assert.equal(person.homepage, "https://example.com");
  assert.equal(person.url, undefined);
  assert.equal(
    mergePeople(base, "name,url\nJane Doe,https://example.com").people[0]
      .homepage,
    "https://example.com",
  );
  assert.throws(() =>
    mergePeople(base, "name,homepage\nJane Doe,javascript:alert(1)"),
  );
});

test("literal line breaks work in profile and numbered research fields", () => {
  const result = mergePeople(
    base,
    String.raw`name,fullBio,note,res-1-desc
Jane Doe,First\nSecond,One\nTwo,Goal\nResult`,
  ).people[0];
  assert.equal(result.fullBio, "First\nSecond");
  assert.equal(result.note, "One\nTwo");
  assert.equal(result.researches[0].description, "Goal\nResult");
});
