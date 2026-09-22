import { parseCSV, sheetText } from "./people-sheet.mjs";
function rows(csv, required) {
  const [header, ...data] = parseCSV(csv);
  const keys = header?.map((x) =>
    x.trim() === "url (optional)" ? "url" : x.trim(),
  );
  if (!keys || required.some((k) => !keys.includes(k)))
    throw new Error("Missing sheet columns");
  if (new Set(keys.filter(Boolean)).size !== keys.filter(Boolean).length)
    throw new Error("Duplicate columns");
  return data
    .filter((r) => r.some((v) => v.trim()))
    .map((r) =>
      Object.fromEntries(
        keys
          .filter(Boolean)
          .map((k) => [
            k,
            [
              "date",
              "type",
              "title",
              "text",
              "tldr",
              "destination",
              "note",
            ].includes(k)
              ? sheetText((r[keys.indexOf(k)] ?? "").trim())
              : (r[keys.indexOf(k)] ?? "").trim(),
          ]),
      ),
    );
}
function website(url) {
  if (url && !/^https?:\/\//i.test(url)) throw new Error("Invalid website URL");
  return url;
}
// Natural numeric ordering: 10 comes before 9, independent of date text.
export function sortNews(items) {
  return [...items].sort((a, b) =>
    String(b.id).localeCompare(String(a.id), "en", { numeric: true }),
  );
}
export function mergeNews(existing, csv) {
  const seen = new Set();
  return sortNews(
    rows(csv, ["id", "date", "type", "title", "text"]).flatMap((row) => {
      if (!row.id || seen.has(row.id))
        throw new Error("Missing or duplicate News id");
      seen.add(row.id);
      const previous = existing.find((n) => n.id === row.id) ?? {};
      const item = Object.fromEntries(
        ["id", "date", "type", "title", "text", "tldr", "url"].map((k) => [
          k,
          row[k] || previous[k] || "",
        ]),
      );
      if (!item.title) return []; // Reserved IDs and unfinished rows are not news yet.
      website(item.url);
      if (!item.url) delete item.url;
      return [item];
    }),
  );
}
export function mergeAlumni(existing, csv) {
  const result = structuredClone(existing);
  const seen = new Set();
  const key = (name) => name.trim().toLowerCase().replace(/\s+/g, " ");
  for (const row of rows(csv, ["name"])) {
    if (!row.name || seen.has(key(row.name)))
      throw new Error("Missing or duplicate Alumni name");
    seen.add(key(row.name));
    let person = result.find((p) => key(p.name) === key(row.name));
    if (!person) {
      if (!row.id) throw new Error("New alumni need an id");
      person = {
        name: row.name,
        id: row.id,
        destination: "",
        url: "",
        topics: [],
      };
      result.push(person);
    }
    for (const field of [
      "destination",
      "url",
      "image",
      "note",
      "id",
      "topics",
    ]) {
      if (!row[field]) continue;
      person[field] =
        field === "topics"
          ? row[field].startsWith("[")
            ? JSON.parse(row[field])
            : row[field]
                .split(/[,;\n]/)
                .map((x) => x.trim())
                .filter(Boolean)
          : row[field];
    }
    website(person.url);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(person.id))
      throw new Error("Invalid alumni id");
    if (
      !Array.isArray(person.topics) ||
      person.topics.some((t) => typeof t !== "string" || !t.trim())
    )
      throw new Error("Invalid alumni topics");
  }
  if (new Set(result.map((p) => p.id)).size !== result.length)
    throw new Error("Duplicate alumni id");
  return result;
}
