import { useState } from "react";

/* =========================================================
   useWindows — цонхны менежер (custom hook)
   Цонх бүр: { id, app, props, x, y, w, h, z, min, max }
   - open(app, props)  : цонх нээх (аль хэдийн нээлттэй бол урд гаргана)
   - close(id)         : хаах
   - focus(id)         : хамгийн урд гаргах (z-index ихэсгэнэ)
   - toggle(id, key)   : min (нуух) эсвэл max (томруулах) солих
   - move(id, x, y)    : байрлал өөрчлөх (чирэх үед)
   ========================================================= */

const SIZES = {
  about: [660, 540],
  projects: [560, 380],
  project: [540, 580],
  skills: [520, 520],
  contact: [500, 500],
  readme: [460, 460],
  shagai: [460, 380],
};

let zTop = 10;

export function useWindows() {
  const [wins, setWins] = useState([]);

  function open(app, props = {}) {
    const id = props.id ? `${app}-${props.id}` : app;
    setWins((ws) => {
      const exists = ws.find((w) => w.id === id);
      if (exists) return ws.map((w) => (w.id === id ? { ...w, min: false, z: ++zTop } : w));

      const [bw, bh] = SIZES[app] || [520, 440];
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(bw, vw - 140);
      const h = Math.min(bh, vh - 130);
      const n = ws.length;
      // Шинэ цонх бүрийг бага зэрэг доош, баруун тийш шилжүүлж байрлуулна (cascade)
      const x = Math.max(10, (vw - w) / 2 - 90 + n * 28);
      const y = Math.min(vh - h - 80, 50 + n * 26);
      return [...ws, { id, app, props, x, y: Math.max(40, y), w, h, z: ++zTop, min: false, max: false }];
    });
  }

  const close = (id) => setWins((ws) => ws.filter((w) => w.id !== id));
  const focus = (id) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z: ++zTop } : w)));
  const toggle = (id, key) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, [key]: !w[key] } : w)));
  const resize = (id, w, h) => setWins((ws) => ws.map((x) => (x.id === id ? { ...x, w, h } : x)));
  const move = (id, x, y) => setWins((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));

  // Хамгийн урд байгаа (нуугдаагүй) цонх = идэвхтэй цонх
  const visible = wins.filter((w) => !w.min);
  const active = visible.length ? visible.reduce((a, b) => (a.z > b.z ? a : b)) : null;

  return { wins, active, open, close, focus, toggle, move, resize };
}
