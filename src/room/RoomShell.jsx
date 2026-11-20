import { useMemo } from "react";
import * as THREE from "three";

/* =========================================================
   RoomShell — өрөөний шал, хана, цонх, хана дээрх зураг, хивс.
   Цонхны цаана Улаанбаатарын тэнгэр ба Богд уулын дүрс (canvas-аар зурсан).
   ========================================================= */

function canvasTexture(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Цонхны цаана: тэнгэр, сар/нар, Богд уул, хотын гэрэл
function useSkyTexture(night) {
  return useMemo(
    () =>
      canvasTexture(512, 384, (g, w, h) => {
        const sky = g.createLinearGradient(0, 0, 0, h);
        if (night) { sky.addColorStop(0, "#14142a"); sky.addColorStop(1, "#3a2a4a"); }
        else { sky.addColorStop(0, "#a9cbe8"); sky.addColorStop(1, "#f6e2c8"); }
        g.fillStyle = sky;
        g.fillRect(0, 0, w, h);
        if (night) {
          g.fillStyle = "#ffffff";
          for (let i = 0; i < 70; i++) g.fillRect(Math.random() * w, Math.random() * h * 0.6, 1.5, 1.5);
          g.fillStyle = "#f6ecd2";
          g.beginPath(); g.arc(390, 90, 26, 0, Math.PI * 2); g.fill();
        } else {
          g.fillStyle = "#fff4d6";
          g.beginPath(); g.arc(390, 100, 32, 0, Math.PI * 2); g.fill();
        }
        // Богд уул
        g.fillStyle = night ? "#1c1626" : "#8fa39a";
        g.beginPath();
        g.moveTo(0, 270);
        [[60, 240], [120, 210], [180, 225], [250, 190], [320, 215], [380, 200], [450, 230], [512, 220], [512, 384], [0, 384]].forEach(([x, y]) => g.lineTo(x, y));
        g.fill();
        // Хотын байшингууд
        g.fillStyle = night ? "#0e0c14" : "#b9b0a3";
        for (let x = 0; x < w; x += 26) {
          const bh = 40 + ((x * 37) % 70);
          g.fillRect(x, h - bh, 22, bh);
          if (night) {
            g.fillStyle = "#f0d999";
            for (let wy = h - bh + 8; wy < h - 6; wy += 12) if ((x + wy) % 3) g.fillRect(x + 5, wy, 4, 4);
            g.fillStyle = "#0e0c14";
          }
        }
      }),
    [night]
  );
}

// Хананы хуанли: тухайн сарын өдрүүд, өнгөрсөн өдөр зураастай, deadline-ууд улаанаар дугуйлсан
const DEADLINES = [
  { day: 9, label: "SWE334" },
  { day: 17, label: "Лаб" },
  { day: 24, label: "Хамгаалалт" },
  { day: 28, label: "Тайлан" },
];

function useCalendarTexture() {
  return useMemo(
    () =>
      // 2 дахин их нягтралтай зурж, текстийг тод болгоно
      canvasTexture(600, 800, (g) => {
        g.scale(2, 2);
        const w = 300;
        const h = 400;
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const today = now.getDate();
        const days = new Date(year, month + 1, 0).getDate();
        const first = (new Date(year, month, 1).getDay() + 6) % 7; // Даваа гарагаас эхэлнэ

        // Цаас ба дээд хэсэг
        g.fillStyle = "#f6f2ea";
        g.fillRect(0, 0, w, h);
        g.fillStyle = "#f2b3a6";
        g.fillRect(0, 22, w, 64);
        // Өлгөөрийн цагирагууд
        g.fillStyle = "#3a3a40";
        for (let x = 40; x < w; x += 44) g.fillRect(x, 6, 8, 26);
        g.fillStyle = "#1d1b19";
        g.textAlign = "center";
        g.font = "bold 30px Georgia, serif";
        g.fillText(`${month + 1}-р сар`, w / 2, 62);
        g.font = "14px monospace";
        g.fillText(String(year), w / 2, 80);

        // Гаригууд
        const cols = ["Да", "Мя", "Лх", "Пү", "Ба", "Бя", "Ня"];
        const cw = (w - 20) / 7;
        g.font = "bold 13px monospace";
        g.fillStyle = "#6f6a63";
        cols.forEach((c, i) => g.fillText(c, 10 + cw * i + cw / 2, 108));

        // Өдрүүд
        g.font = "16px monospace";
        for (let d = 1; d <= days; d++) {
          const idx = first + d - 1;
          const cx = 10 + cw * (idx % 7) + cw / 2;
          const cy = 136 + Math.floor(idx / 7) * 44;
          g.fillStyle = "#1d1b19";
          g.fillText(String(d), cx, cy);
          // Өнгөрсөн өдрийг зураасаар дарна
          if (d < today) {
            g.strokeStyle = "rgba(29,27,25,0.45)";
            g.lineWidth = 2;
            g.beginPath(); g.moveTo(cx - 12, cy + 4); g.lineTo(cx + 12, cy - 14); g.stroke();
          }
          // Deadline — улаан бийрээр дугуйлсан мэт
          const dl = DEADLINES.find((x) => x.day === d);
          if (dl) {
            g.strokeStyle = "#d9304f";
            g.lineWidth = 3;
            g.beginPath();
            g.ellipse(cx, cy - 5, 18, 15, -0.2, 0, Math.PI * 1.9);
            g.stroke();
            g.fillStyle = "#d9304f";
            g.font = "bold 10px monospace";
            g.fillText(dl.label, cx, cy + 14);
            g.font = "16px monospace";
          }
          // Өнөөдөр
          if (d === today) {
            g.fillStyle = "rgba(240,217,153,0.6)";
            g.fillRect(cx - 17, cy - 20, 34, 28);
            g.fillStyle = "#1d1b19";
            g.fillText(String(d), cx, cy);
          }
        }
      }),
    []
  );
}

export function RoomShell({ night }) {
  const sky = useSkyTexture(night);
  const calendar = useCalendarTexture();
  const wall = night ? "#2a2730" : "#efe9df";
  const floor = night ? "#1f1b20" : "#cdbfae";

  return (
    <group>
      {/* Шал */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color={floor} roughness={0.9} />
      </mesh>
      {/* Дугуй хивс */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.1, 0.002, 0.6]} receiveShadow>
        <circleGeometry args={[1.05, 48]} />
        <meshStandardMaterial color={night ? "#4a3a4f" : "#e8c9c2"} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.1, 0.003, 0.6]}>
        <ringGeometry args={[0.85, 0.9, 48]} />
        <meshStandardMaterial color={night ? "#6b5470" : "#f2b3a6"} roughness={1} />
      </mesh>

      {/* Арын ба зүүн хана */}
      <mesh position={[0, 2, -0.9]} receiveShadow>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      <mesh position={[-2.3, 2, 2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      {/* Хананы доод хүрээ */}
      <mesh position={[0, 0.05, -0.89]}>
        <boxGeometry args={[12, 0.1, 0.02]} />
        <meshStandardMaterial color={night ? "#3a3540" : "#ddd4c6"} />
      </mesh>

      {/* Цонх */}
      <group position={[1.45, 1.75, -0.885]}>
        <mesh>
          <boxGeometry args={[1.06, 0.84, 0.03]} />
          <meshStandardMaterial color="#f6f2ea" />
        </mesh>
        <mesh position={[0, 0, 0.017]}>
          <planeGeometry args={[0.96, 0.74]} />
          <meshBasicMaterial map={sky} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[0.03, 0.74, 0.01]} />
          <meshStandardMaterial color="#f6f2ea" />
        </mesh>
        <mesh position={[0, -0.44, 0.05]}>
          <boxGeometry args={[1.14, 0.04, 0.12]} />
          <meshStandardMaterial color="#f6f2ea" />
        </mesh>
      </group>

      {/* Хананы хуанли (deadline-ууд дугуйлсан) — хадаас дээр өлгөөтэй */}
      <group position={[-0.85, 1.62, -0.885]} rotation={[0, 0, 0.03]}>
        <mesh position={[0, 0.34, 0.02]}>
          <sphereGeometry args={[0.012, 10, 10]} />
          <meshStandardMaterial color="#8d877e" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.004]}>
          <planeGeometry args={[0.45, 0.6]} />
          <meshStandardMaterial map={calendar} roughness={0.85} />
        </mesh>
      </group>

      {/* Хананы тавиур + жижиг гэр */}
      <group position={[-1.6, 1.3, -0.78]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.03, 0.2]} />
          <meshStandardMaterial color="#cfc9c0" />
        </mesh>
        <mesh position={[-0.12, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.1, 16]} />
          <meshStandardMaterial color="#f6f2ea" />
        </mesh>
        <mesh position={[-0.12, 0.15, 0]} castShadow>
          <coneGeometry args={[0.08, 0.06, 16]} />
          <meshStandardMaterial color="#d9557e" />
        </mesh>
        <mesh position={[-0.12, 0.06, 0.071]}>
          <planeGeometry args={[0.03, 0.06]} />
          <meshStandardMaterial color="#d9557e" />
        </mesh>
        <mesh position={[0.12, 0.08, 0]} castShadow>
          <boxGeometry args={[0.04, 0.13, 0.12]} />
          <meshStandardMaterial color="#a9c4b0" />
        </mesh>
        <mesh position={[0.17, 0.07, 0]} castShadow>
          <boxGeometry args={[0.035, 0.11, 0.12]} />
          <meshStandardMaterial color="#b8acd9" />
        </mesh>
      </group>
    </group>
  );
}
