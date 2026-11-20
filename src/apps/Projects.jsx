import { useLang } from "../lib/lang";
import { PROJECTS, PROFILE } from "../data/content";
import { Folder } from "../components/icons";

/* "Бүтээлүүд" хавтас: бүтээл бүр нэг хавтас, дарахад тусдаа цонх нээгдэнэ */
export function Projects({ onOpenProject }) {
  const { lang, t } = useLang();
  return (
    <div className="folder">
      <div className="folder__grid">
        {PROJECTS.map((p) => (
          <button key={p.id} className="icon icon--dark" onClick={() => onOpenProject(p)}>
            <Folder color={p.color} />
            <span>{p[lang].title}</span>
          </button>
        ))}
      </div>
      <div className="statusbar">{PROJECTS.length} {t.items} · {t.hint}</div>
    </div>
  );
}

// repo талбараас GitHub-ийн бүтэн холбоос гаргана
function repoUrl(p) {
  if (!p.repo) return "";
  if (p.repo.startsWith("http")) return p.repo;
  return PROFILE.github ? `https://github.com/${PROFILE.github}/${p.repo}` : "";
}

/* Нэг бүтээлийн дэлгэрэнгүй цонх */
export function ProjectDetail({ project: p }) {
  const { lang, t } = useLang();
  const c = p[lang];
  const link = (url, label) =>
    url ? (
      <a className="btn btn--pri" href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a>
    ) : (
      <span className="btn btn--off">{label} · {t.soon}</span>
    );

  return (
    <article className="project">
      <img src={p.image} alt={c.title} />
      <div className="project__body">
        <p className="meta">{c.type}</p>
        <h2>{c.title}</h2>
        <p className="project__desc">{c.desc}</p>
        <dl className="kv">
          <dt>{t.myRole}</dt><dd>{c.role}</dd>
          <dt>{t.stack}</dt>
          <dd className="tags">{p.stack.map((s) => <span key={s}>{s}</span>)}</dd>
        </dl>
        <div className="project__links">
          {link(p.live, t.live)}
          {link(repoUrl(p), t.code)}
        </div>
      </div>
    </article>
  );
}
