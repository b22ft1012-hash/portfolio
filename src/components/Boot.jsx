import { useEffect, useState } from "react";
import { useLang } from "../lib/lang";

/* Ачааллын дэлгэц: нөөцүүд нэг нэгээрээ "ачаалагдаж", дараа нь дарахад desktop нээгдэнэ */
export default function Boot({ onDone }) {
  const { t, toggle } = useLang();
  const total = t.boot.res.length;
  const [step, setStep] = useState(0);
  const ready = step >= total;

  useEffect(() => {
    if (ready) return;
    const id = setTimeout(() => setStep((s) => s + 1), 260);
    return () => clearTimeout(id);
  }, [step, ready]);

  useEffect(() => {
    const key = (e) => e.key === "Enter" && ready && onDone();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [ready, onDone]);

  // "Нэр .......... статус" маягаар цэгээр дүүргэнэ
  const dots = (s) => s + " " + ".".repeat(Math.max(2, 24 - s.length)) + " ";

  return (
    <div className="boot" onClick={() => ready && onDone()} role="button" tabIndex={0}>
      <button className="chip boot__lang" onClick={(e) => { e.stopPropagation(); toggle(); }}>MN / EN</button>
      <div className="boot__hd">
        <span>Namjilmaa</span><span>{t.boot.released}</span>
        <span>NamjaaOS</span><span>NamjaaOS (C)2026 · UFE</span>
      </div>

      <h3>{t.boot.components}</h3>
      <ul>
        {t.boot.comps.map((c) => (
          <li key={c}>{dots(c)}<span className="ok">{t.boot.linked}</span></li>
        ))}
      </ul>

      <h3>{t.boot.loading} ({Math.min(step, total)}/{total})</h3>
      <ul>
        {t.boot.res.map((r, i) => (
          <li key={r}>{dots(r)}{i < step ? <span className="ok">(2/2)</span> : "(0/2)"}</li>
        ))}
      </ul>

      {ready && <p className="boot__cont">{t.boot.cont} <b>_</b></p>}
    </div>
  );
}
