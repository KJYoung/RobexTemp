export function parseCSV(text) {
  const rows = [];
  let row = [],
    value = "",
    quoted = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        value += '"';
        i++;
      } else if (c === '"') quoted = false;
      else value += c;
    } else if (c === '"') {
      if (value) throw new Error("Invalid CSV quoting");
      quoted = true;
    } else if (c === ",") {
      row.push(value);
      value = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else value += c;
  }
  if (quoted) throw new Error("Unclosed CSV quote");
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}
const key = (value) =>
  value.trim().toLocaleLowerCase("en-US").replace(/\s+/g, " ");
const fields = new Set([
  "name",
  "group",
  "role",
  "email",
  "url",
  "image",
  "note",
  "id",
  "topics",
  "fullBio",
  "researches",
]);
function list(value, field) {
  if (value.startsWith("[")) {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) throw new Error(`${field} must be an array`);
    return parsed;
  }
  if (field === "topics")
    return value
      .split(/[,;\n]/)
      .map((x) => x.trim())
      .filter(Boolean);
  throw new Error("researches must be a JSON array");
}
export function mergePeople(existing, csv) {
  const [rawHeaders, ...rows] = parseCSV(csv);
  if (!rawHeaders) throw new Error("People sheet is empty");
  const headers = rawHeaders.map((h) => h.trim());
  if (!headers.includes("name"))
    throw new Error("People row 1 must contain a name column");
  const active = headers.filter(Boolean);
  if (new Set(active).size !== active.length)
    throw new Error("Duplicate column name");
  for (const h of active)
    if (!fields.has(h) && !/^res-[1-9]\d*-(title|desc|url)$/.test(h))
      throw new Error(`Unknown People column: ${h}`);
  const result = structuredClone(existing);
  const index = new Map();
  for (const p of result) {
    if (index.has(key(p.name)))
      throw new Error(`Duplicate local name: ${p.name}`);
    index.set(key(p.name), p);
  }
  const seen = new Set();
  let matched = 0;
  const changes = [];
  for (const row of rows) {
    if (row.every((v) => !v.trim())) continue;
    const data = Object.fromEntries(
      headers.flatMap((h, i) => (h ? [[h, (row[i] ?? "").trim()]] : [])),
    );
    if (!data.name) throw new Error("A nonempty People row has no name");
    const id = key(data.name);
    if (seen.has(id)) throw new Error(`Duplicate sheet name: ${data.name}`);
    seen.add(id);
    const p = index.get(id);
    if (!p)
      throw new Error(
        `Unknown name: ${data.name}. Add a local person first or correct the sheet name.`,
      );
    matched++;
    for (const [field, value] of Object.entries(data)) {
      if (!value || field === "name" || field.startsWith("res-")) continue;
      let next = value;
      if (field === "topics") {
        next = list(value, field);
        if (next.some((x) => typeof x !== "string" || !x.trim()))
          throw new Error("topics must contain nonempty strings");
        next = [...new Set(next.map((x) => x.trim()))];
      }
      if (field === "researches") {
        next = list(value, field);
        if (
          next.some(
            (r) =>
              !r ||
              typeof r.title !== "string" ||
              typeof r.description !== "string",
          )
        )
          throw new Error("Each research needs title and description");
      }
      if (field === "email")
        next = value.replace(/@/g, " (at) ").replace(/\./g, " (dot) ");
      if (field === "url" && !/^https?:\/\//i.test(value))
        throw new Error(`Invalid website URL for ${p.name}`);
      if (field === "id" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
        throw new Error(`Invalid profile id for ${p.name}`);
      if (JSON.stringify(p[field]) !== JSON.stringify(next)) {
        p[field] = next;
        changes.push(`${p.name}: ${field}`);
      }
    }
    const researchBefore = JSON.stringify(p.researches);
    for (const [field, value] of Object.entries(data)) {
      const m = field.match(/^res-([1-9]\d*)-(title|desc|url)$/);
      if (!m || !value) continue;
      const i = Number(m[1]) - 1;
      if (i > 100) throw new Error("Research index exceeds 101");
      p.researches ??= [];
      p.researches[i] ??= { title: "", description: "" };
      p.researches[i][m[2] === "desc" ? "description" : m[2]] = value;
    }
    if (Array.from(p.researches).some((r) => !r || !r.title))
      throw new Error(
        `Research entries must be consecutive and have titles: ${p.name}`,
      );
    if (JSON.stringify(p.researches) !== researchBefore)
      changes.push(`${p.name}: researches`);
  }
  if (!matched)
    throw new Error("No named People rows found; keeping the existing JSON");
  if (new Set(result.map((p) => p.id)).size !== result.length)
    throw new Error("Duplicate profile id after merge");
  return { people: result, matched, changes };
}
