import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { mergePeople } from "./people-sheet.mjs";
const root = new URL("../", import.meta.url);
const sheetId = "1Ji6d41RBSASJ6CPgB0OV_-XoevKH5qxCY_Xt_5u2tbA";
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
const target = new URL("src/content/people.json", root);
try {
  if (process.env.SKIP_PEOPLE_SYNC === "1") {
    console.log("People sync explicitly skipped.");
    process.exit(0);
  }
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok)
    throw new Error(
      `Sheet request failed (${response.status}); check read access`,
    );
  const csv = await response.text();
  if (/^\s*</.test(csv))
    throw new Error("Google returned a login/HTML page instead of People CSV");
  const existing = JSON.parse(await readFile(target, "utf8"));
  const { people, matched, changes } = mergePeople(existing, csv);
  const catalogPath = new URL("src/content/topics.json", root);
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  const nextCatalog = [...catalog];
  for (const p of people)
    for (const id of p.topics)
      if (!nextCatalog.some((t) => t.id === id))
        nextCatalog.push({ id, label: id });
  if (changes.length) {
    const temporary = fileURLToPath(target) + ".tmp";
    try {
      await writeFile(temporary, JSON.stringify(people, null, 2) + "\n");
      await rename(temporary, target);
    } finally {
      await unlink(temporary).catch(() => {});
    }
  }
  if (nextCatalog.length !== catalog.length)
    await writeFile(catalogPath, JSON.stringify(nextCatalog, null, 2) + "\n");
  console.log(
    `People sheet: ${matched} names matched, ${changes.length} field updates.`,
  );
  for (const change of changes) console.log(`  ${change}`);
} catch (error) {
  console.error(
    `People sync failed: ${error.message}. Build stopped; existing people.json is preserved for validation/download errors.`,
  );
  process.exitCode = 1;
}
