import { useRef } from "react";
import { useLang } from "../lib/lang";

export default function About({ onOpen }) {
  const { t } = useLang();
  const bio = useRef(null);

  return (
    <div className="about">
      <div className="about__hero">
        <h1>{t.name}</h1>
        <p className="about__role">{t.role}</p>
        <p className="about__line">{t.line}</p>
        <div className="about__nav">
          <button className="btn" onClick={() => bio.current.scrollIntoView({ behavior: "smooth" })}>{t.apps.about}</button>
          <button className="btn" onClick={() => onOpen("projects")}>{t.apps.projects}</button>
          <button className="btn" onClick={() => onOpen("skills")}>{t.apps.skills}</button>
          <button className="btn" onClick={() => onOpen("contact")}>{t.apps.contact}</button>
        </div>
      </div>

      <div className="about__bio" ref={bio}>
        <div>
          <p className="about__full">{t.fullName}</p>
          {t.bio.map((p) => <p key={p}>{p}</p>)}
        </div>
        <div>
          <h3>{t.timelineTitle}</h3>
          <ul className="timeline">
            {t.timeline.map((x) => (
              <li key={x.what}>
                <span className="timeline__when">{x.when}</span>
                <b>{x.what}</b>
                <span>{x.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
