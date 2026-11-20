import { useEffect, useState } from "react";
import { useLang } from "../lib/lang";
import { Logo } from "./icons";

/* Дээд мөр: идэвхтэй апп-ын нэр, дуу, хэл солих, цаг */
export default function TopBar({ title, soundOn, onSound, theme, onTheme, onLogo }) {
  const { lang, toggle } = useLang();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toTimeString().slice(0, 5);
  const date = lang === "mn"
    ? `${now.getMonth() + 1}-р сарын ${now.getDate()} ·`
    : now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

  return (
    <header className="topbar">
      <div className="topbar__left">
        {/* Лого дээр давхар дарахад нууц "Шагай" апп нээгдэнэ */}
        <span className="topbar__logo" onDoubleClick={onLogo} title="NamjaaOS"><Logo /></span>
        <span className="chip topbar__title">{title}</span>
      </div>
      <div className="topbar__right">
        <button className="chip" onClick={onSound} aria-pressed={soundOn} title="Sound">{soundOn ? "♪ ON" : "♪ OFF"}</button>
        <button className="chip" onClick={onTheme} title={lang === "mn" ? "Шөнө / Өдөр" : "Night / Day"}>
          {theme === "night" ? "☾" : "☀"}
        </button>
        <button className="chip" onClick={toggle} title="Хэл / Language">
          <b className={lang === "mn" ? "on" : ""}>MN</b> / <b className={lang === "en" ? "on" : ""}>EN</b>
        </button>
        <span className="topbar__clock"><span className="topbar__date">{date}</span> {time}</span>
      </div>
    </header>
  );
}
