import { useState } from "react";
import { useLang } from "../lib/lang";
import { sound } from "../lib/sound";

/* =========================================================
   Шагай — нуугдмал апп (easter egg).
   4 шагай орхиход тус бүр 4 талын аль нэгээр буна.
   Бодит шагай шиг хонь, ямаа илүү олон, морь, тэмээ ховор буудаг.
   ========================================================= */

const SIDES = [
  { key: "sheep", weight: 0.38 },
  { key: "goat", weight: 0.38 },
  { key: "horse", weight: 0.12 },
  { key: "camel", weight: 0.12 },
];

// Жингээр (магадлалаар) санамсаргүй тал сонгох
function randomSide() {
  let r = Math.random();
  for (const s of SIDES) {
    if ((r -= s.weight) <= 0) return s.key;
  }
  return "sheep";
}

// Тал бүрийн тэмдэг (өөрөө зурсан)
const MARK = {
  horse: <path d="M-14 -4 C-6 -14 6 -14 14 -4" fill="none" stroke="#7a4a22" strokeWidth="3.5" strokeLinecap="round" />,
  camel: <circle r="9" fill="none" stroke="#7a4a22" strokeWidth="3.5" />,
  sheep: <path d="M-12 -2 Q0 12 12 -2" fill="none" stroke="#7a4a22" strokeWidth="3.5" strokeLinecap="round" />,
  goat: <path d="M-12 -5 H12 M-8 5 H8" stroke="#7a4a22" strokeWidth="3.5" strokeLinecap="round" />,
};

function Bone({ side, rolling, i }) {
  return (
    <svg viewBox="-40 -40 80 80" className={`bone ${rolling ? "is-rolling" : ""}`} style={{ animationDelay: `${i * 60}ms` }}>
      <path d="M-30 -8 C-30 -36 30 -36 30 -8 C36 12 26 32 0 32 C-26 32 -36 12 -30 -8Z" fill="#f2e3c8" stroke="#000" strokeWidth="1.5" />
      <path d="M-22 18 C-10 26 10 26 22 18" fill="none" stroke="#d9c6a3" strokeWidth="2" />
      {MARK[side]}
    </svg>
  );
}

const ORDER = ["horse", "camel", "sheep", "goat"];

/* Буусан шагайнаас мэрэг гаргах:
   - 4 нь ижил → тусгай мэрэг
   - 4 нь өөр (дөрвөн бэрх) → маш азтай
   - бусад үед → хамгийн олон буусан тал + хэдэн морь буусан */
function readFortune(bones, f) {
  const count = Object.fromEntries(ORDER.map((k) => [k, bones.filter((b) => b === k).length]));
  if (bones.every((b) => b === bones[0])) return { count, text: [f.four[bones[0]]] };
  if (ORDER.every((k) => count[k] === 1)) return { count, text: [f.allDiff] };
  const top = ORDER.reduce((a, b) => (count[b] > count[a] ? b : a));
  return { count, text: [f.major[top], f.horses[count.horse]] };
}

export default function Shagai() {
  const { t } = useLang();
  const s = t.shagai;
  const [bones, setBones] = useState(["horse", "camel", "sheep", "goat"]);
  const [rolling, setRolling] = useState(false);
  const [count, setCount] = useState(0);

  function roll() {
    if (rolling) return;
    setRolling(true);
    sound.beep(300, 0.05);
    setTimeout(() => {
      const next = [randomSide(), randomSide(), randomSide(), randomSide()];
      setBones(next);
      setRolling(false);
      setCount((c) => c + 1);
      next.forEach((_, i) => setTimeout(() => sound.beep(500 + i * 90, 0.05), i * 70));
    }, 650);
  }

  const result = !rolling && count > 0 ? readFortune(bones, s.fortune) : null;

  return (
    <div className="shagai">
      <p className="shagai__intro">{s.intro}</p>
      <div className="shagai__table">
        {bones.map((b, i) => (
          <figure key={i}>
            <Bone side={b} rolling={rolling} i={i} />
            <figcaption>{rolling ? "…" : s.sides[b]}</figcaption>
          </figure>
        ))}
      </div>
      <div className="shagai__bar">
        <button className="btn btn--pri" onClick={roll} disabled={rolling}>🎲 {s.roll}</button>
        <span className="meta">{s.rolls}: {count}</span>
      </div>

      {result ? (
        /* Орхисны дараа: тоо ба мэрэг */
        <section className="shagai__result">
          <h3>{s.resultTitle}</h3>
          <p className="shagai__count">
            {ORDER.filter((k) => result.count[k]).map((k) => `${s.sides[k]} ×${result.count[k]}`).join(" · ")}
          </p>
          {result.text.map((line) => <p key={line}>{line}</p>)}
        </section>
      ) : (
        /* Орхихоос өмнө: 4 талын утга */
        <section className="shagai__result">
          <h3>{s.legendTitle}</h3>
          <ul className="shagai__legend">
            {ORDER.map((k) => <li key={k}><b>{s.sides[k]}</b> — {s.meanings[k]}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
