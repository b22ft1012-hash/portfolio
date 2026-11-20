import { useRef } from "react";

/* =========================================================
   Window — нэг цонх. Гарчгаас нь чирж зөөнө.
   Чирэх: pointerdown үед хулгана ба цонхны зөрүүг тогтоож,
   pointermove бүрт шинэ байрлалыг move()-оор state-д хадгална.
   ========================================================= */
export default function Window({ win, title, active, onFocus, onClose, onMin, onMax, onMove, onResize, children }) {
  const drag = useRef(null);
  const box = useRef(null);

  // CSS resize-аар хэмжээг өөрчилсний дараа шинэ хэмжээг state-д хадгална
  function syncSize() {
    const el = box.current;
    if (el && !win.max && (el.offsetWidth !== win.w || el.offsetHeight !== win.h)) onResize(el.offsetWidth, el.offsetHeight);
  }

  function down(e) {
    if (e.target.closest(".ctl") || win.max) return;
    drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function moveTo(e) {
    if (!drag.current) return;
    const x = Math.min(window.innerWidth - 80, Math.max(80 - win.w, e.clientX - drag.current.dx));
    const y = Math.min(window.innerHeight - 60, Math.max(30, e.clientY - drag.current.dy));
    onMove(x, y);
  }
  const up = () => (drag.current = null);

  if (win.min) return null;

  return (
    <section
      className={`win ${active ? "active" : ""} ${win.max ? "max" : ""}`}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }}
      ref={box}
      onPointerDown={onFocus}
      onPointerUp={syncSize}
      role="dialog"
      aria-label={title}
    >
      <div className="win__title" onPointerDown={down} onPointerMove={moveTo} onPointerUp={up} onDoubleClick={onMax}>
        <span className="win__name">{title}</span>
        <span className="win__stripes" />
        <span className="ctl">
          <button onClick={onMin} aria-label="Minimise">▾</button>
          <button onClick={onMax} aria-label="Maximise">▴</button>
          <button onClick={onClose} aria-label="Close">✕</button>
        </span>
      </div>
      <div className="win__body">{children}</div>
    </section>
  );
}
