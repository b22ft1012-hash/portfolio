import { useLang } from "../lib/lang";
import { PROFILE } from "../data/content";

export default function Readme() {
  const { t } = useLang();
  return (
    <div className="readme">
      <pre>{t.readme}</pre>
      {PROFILE.cv ? (
        <a className="btn btn--pri" href={PROFILE.cv} download="Namjilmaa_Erdene-Ochir_CV.pdf">⬇ {t.cv}</a>
      ) : (
        <span className="btn btn--off">⬇ {t.cv} · {t.soon}</span>
      )}
    </div>
  );
}
