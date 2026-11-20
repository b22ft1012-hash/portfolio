import { useLang } from "../lib/lang";
import { SKILLS, PROJECTS } from "../data/content";

/* Ур чадвар: хэрэгсэл бүр аль бүтээлд ашиглагдсаныг харуулна; хэл — түвшинтэй */
export default function Skills() {
  const { lang, t } = useLang();
  const name = (id) => PROJECTS.find((p) => p.id === id)?.[lang].title;

  const group = (key, color) => (
    <section className="skills__group">
      <h3>{t.skillGroups[key]}</h3>
      {SKILLS[key].map((s) => (
        <div className="skill" key={s.name}>
          <span className="skill__dot" style={{ background: color }} />
          <b>{s.name}</b>
          <span className="skill__used">{s.used.length ? `${t.usedIn}: ${s.used.map(name).join(", ")}` : ""}</span>
        </div>
      ))}
    </section>
  );

  return (
    <div className="skills">
      {group("design", "#f2b3a6")}
      {group("dev", "#b8acd9")}
      <section className="skills__group">
        <h3>{t.skillGroups.lang}</h3>
        {t.langs.map(([n, level, v]) => (
          <div className="lang" key={n}>
            <b>{n}</b>
            <span className="lang__bar" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= v ? "on" : ""} />)}
            </span>
            <span className="lang__lvl">{level}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
