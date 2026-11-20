import { useEffect, useState } from "react";

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
const ICONS_W = 110; // баруун талын icon-уудын өргөн

// Цонхыг дэлгэцийн дотор байлгах (дэлгэцийн хэмжээ өөрчлөгдөхөд ч)
function clamp(win) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = Math.min(win.w, vw - 20);
  const h = Math.min(win.h, vh - 110);
  const x = Math.min(Math.max(10, win.x), Math.max(10, vw - ICONS_W - w));
  const y = Math.min(Math.max(40, win.y), Math.max(40, vh - 80 - h));
  return { ...win, w, h, x, y };
}

export function useWindows() {
  const [wins, setWins] = useState([]);

  // Цонхны хэмжээ өөрчлөгдөхөд (жишээ нь утсаа эргүүлэх) цонхнуудыг дэлгэц дотор буцааж оруулна
  useEffect(() => {
    const onResize = () => setWins((ws) => ws.map(clamp));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function open(app, props = {}) {
    const id = props.id ? `${app}-${props.id}` : app;
    setWins((ws) => {
      const exists = ws.find((w) => w.id === id);
      if (exists) return ws.map((w) => (w.id === id ? { ...w, min: false, z: ++zTop } : w));

      const [bw, bh] = SIZES[app] || [520, 440];
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(bw, vw - ICONS_W - 20);
      // Өндөр дэлгэцэнд (таблет) цонхыг дэлгэцийн 62%-иас багагүй өндөртэй болгоно
      // (жижиг агуулгатай "Бүтээлүүд", "Шагай" цонхыг томруулахгүй)
      const grow = app !== "projects" && app !== "shagai";
      const h = Math.min(grow ? Math.max(bh, Math.round(vh * 0.62)) : bh, vh - 130);
      const n = ws.length;
      // Баруун талын icon-уудыг хасаад үлдсэн талбайн голд, дараагийнхыг бага зэрэг шилжүүлж байрлуулна
      const x = (vw - ICONS_W - w) / 2 + n * 26;
      const y = 50 + n * 24;
      return [...ws, clamp({ id, app, props, x, y, w, h, z: ++zTop, min: false, max: false })];
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
