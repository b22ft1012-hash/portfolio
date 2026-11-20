import { useLang } from "../lib/lang";
import { PROFILE } from "../data/content";

/* Холбоо барих: имэйл апп маягийн форм (mailto) + бусад холбоос */
export default function Contact() {
  const { t } = useLang();

  function send(e) {
    e.preventDefault();
    const f = new FormData(e.target);
    const body = `${f.get("msg")}\n\n— ${f.get("from")}`;
    window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(f.get("subj"))}&body=${encodeURIComponent(body)}`;
  }

  const links = [
    ["Email", `mailto:${PROFILE.email}`],
    ["Facebook", PROFILE.facebook],
    ["GitHub", PROFILE.github && `https://github.com/${PROFILE.github}`],
    ["LinkedIn", PROFILE.linkedin],
  ].filter(([, url]) => url);

  return (
    <div className="mail">
      <form onSubmit={send}>
        <div className="mail__toolbar"><button className="btn btn--pri" type="submit">✉ {t.send}</button></div>
        <label className="mail__row"><span>{t.to}:</span><input value={`Namjilmaa <${PROFILE.email}>`} readOnly /></label>
        <label className="mail__row"><span>{t.from}:</span><input name="from" required placeholder={t.fromPh} /></label>
        <label className="mail__row"><span>{t.subj}:</span><input name="subj" defaultValue={t.subjDefault} key={t.subjDefault} /></label>
        <textarea name="msg" required placeholder={t.msgPh} aria-label="Message" />
      </form>
      <div className="mail__links">
        <span className="meta">{t.otherLinks}</span>
        {links.map(([label, url]) => (
          <a key={label} className="btn" href={url} target={url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{label}</a>
        ))}
      </div>
    </div>
  );
}
