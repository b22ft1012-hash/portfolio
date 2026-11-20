import { AppIcon } from "./icons";
import { useLang } from "../lib/lang";

export const APPS = ["about", "projects", "skills", "contact", "readme"];

/* Баруун талын icon-ууд */
export function DesktopIcons({ onOpen }) {
  const { t } = useLang();
  return (
    <nav className="icons" aria-label="Desktop">
      {APPS.map((a) => (
        <button key={a} className="icon" onClick={() => onOpen(a)}>
          {AppIcon[a]}
          <span>{t.apps[a]}</span>
        </button>
      ))}
    </nav>
  );
}

/* Доод талын dock — нээлттэй апп-ын доор жижиг цэг гарна */
export function Dock({ onOpen, openApps }) {
  const { t } = useLang();
  return (
    <nav className="dock" aria-label="Dock">
      {APPS.map((a, i) => (
        <span key={a} className="dock__slot">
          {i === 4 && <span className="dock__sep" />}
          <button className={openApps.includes(a) ? "is-open" : ""} onClick={() => onOpen(a)} aria-label={t.apps[a]}>
            {AppIcon[a]}
            <span className="dock__tip">{t.apps[a]}</span>
          </button>
        </span>
      ))}
    </nav>
  );
}
