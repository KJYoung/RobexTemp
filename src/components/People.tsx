import Markdown from "react-markdown";
import type { Person } from "../../scripts/people-sheet.mjs";
export type Topic = { id: string; label: string };
const profileUrl = (p: Person) => `#people/${p.id}`;
function Portrait({ person }: { person: Person }) {
  return person.image ? (
    <img
      src={
        /^https?:\/\//i.test(person.image)
          ? person.image
          : import.meta.env.BASE_URL + person.image
      }
      alt={person.name}
      loading="lazy"
    />
  ) : (
    <div
      className="initials"
      aria-label={`${person.name} — no portrait available`}
    >
      {person.name
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </div>
  );
}
function TopicTags({ ids, topics }: { ids: string[]; topics: Topic[] }) {
  return (
    <div className="topic-tags">
      {topics
        .filter((t) => ids.includes(t.id))
        .map((t) => (
          <span className="topic-tag" key={t.id}>
            {t.label}
          </span>
        ))}
    </div>
  );
}
export function PeopleDirectory({
  selectedTopic,
  onTopicChange,
  allPeople,
  topics,
}: {
  allPeople: Person[];
  topics: Topic[];
  selectedTopic: string;
  onTopicChange: (id: string) => void;
}) {
  const visible = allPeople.filter(
    (p) =>
      p.group === "Principal Investigator" ||
      !selectedTopic ||
      p.topics.includes(selectedTopic),
  );
  const groups = [...new Set(visible.map((p) => p.group))];
  return (
    <section className="shell people-directory">
      <h1 className="sr-only">People</h1>
      <aside className="people-toolbar" aria-label="Filter people by topic">
        <label htmlFor="topic-filter">Topics</label>
        <select
          id="topic-filter"
          value={selectedTopic}
          onChange={(e) => onTopicChange(e.target.value)}
        >
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        {selectedTopic && (
          <button className="clear-filter" onClick={() => onTopicChange("")}>
            Clear filter
          </button>
        )}
        <span className="sr-only" role="status">
          {visible.length} people shown
        </span>
      </aside>
      <div className="people-list">
        {groups.map((group) => (
          <section className="people-group" key={group}>
            <h2>{group}</h2>
            <div
              className={
                group === "Principal Investigator"
                  ? "pi-grid"
                  : "people-card-grid"
              }
            >
              {visible
                .filter((p) => p.group === group)
                .map((p) =>
                  group === "Lab Alumni" ? (
                    <article key={p.id} className="alumni-row">
                      <a href={profileUrl(p)}>
                        <strong>{p.name}</strong>
                      </a>
                      <span>{p.destination}</span>
                    </article>
                  ) : (
                    <article
                      key={p.id}
                      className={
                        group === "Principal Investigator"
                          ? "person pi"
                          : "person"
                      }
                    >
                      <a
                        className="portrait-link"
                        href={profileUrl(p)}
                        aria-label={`View ${p.name}'s profile`}
                      >
                        <Portrait person={p} />
                      </a>
                      <div>
                        <h3>
                          <a href={profileUrl(p)}>{p.name}</a>
                        </h3>
                        <p className="role">{p.role}</p>
                        {p.note && <p className="note">{p.note}</p>}
                        {group === "Principal Investigator" && (
                          <p className="pi-bio">
                            Alan leads the Robotic Exploration Lab at the
                            University of Michigan. His work spans robot
                            navigation, environmental monitoring, marine
                            robotics, and perception in challenging
                            environments. He received his PhD from MIT and the
                            Woods Hole Oceanographic Institution in 2025.
                          </p>
                        )}
                        {group !== "Principal Investigator" && (
                          <TopicTags ids={p.topics} topics={topics} />
                        )}
                        {p.email && <span className="email">{p.email}</span>}
                        <a className="text-link" href={p.url}>
                          Website <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                    </article>
                  ),
                )}
            </div>
          </section>
        ))}
        {selectedTopic &&
          !visible.some((p) => p.group !== "Principal Investigator") && (
            <p className="empty-results">
              No people have this topic yet.{" "}
              <button onClick={() => onTopicChange("")}>Show everyone</button>
            </p>
          )}
      </div>
    </section>
  );
}
export function PersonProfile({
  id,
  allPeople,
  topics,
}: {
  id: string;
  allPeople: Person[];
  topics: Topic[];
}) {
  const person = allPeople.find((p) => p.id === id);
  if (!person)
    return (
      <section className="shell section">
        <h1 className="profile-title">Profile not found</h1>
        <a className="text-link" href="#people">
          Back to People
        </a>
      </section>
    );
  return (
    <section className="shell profile-page">
      <a className="text-link profile-back" href="#people">
        ← All people
      </a>
      <div className="profile-layout">
        <aside>
          <Portrait person={person} />
          <p className="role">{person.role}</p>
          {person.note && <p className="note">{person.note}</p>}
          {person.destination && <p>{person.destination}</p>}
          {person.email && <span className="email">{person.email}</span>}
          <a className="text-link" href={person.url}>
            Website <span aria-hidden="true">↗</span>
          </a>
        </aside>
        <div>
          <h1 className="profile-title">{person.name}</h1>
          {person.group !== "Principal Investigator" && (
            <section className="profile-section">
              <h2>Topics</h2>
              <div className="profile-content">
                <TopicTags ids={person.topics} topics={topics} />
              </div>
            </section>
          )}
          <section className="profile-section">
            <h2>Full Bios</h2>
            <div className="profile-content prose">
              {person.fullBio && <Markdown>{person.fullBio}</Markdown>}
            </div>
          </section>
          <section className="profile-section">
            <h2>Researches</h2>
            <div className="profile-content">
              {person.researches.map((r) => (
                <article key={r.title} className="profile-research">
                  <h3>{r.url ? <a href={r.url}>{r.title} ↗</a> : r.title}</h3>
                  <div className="prose">
                    <Markdown>{r.description}</Markdown>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
