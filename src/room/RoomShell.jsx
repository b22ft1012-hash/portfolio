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

// Хана дээрх зурагт хуудас (SparkDay)
function usePosterTexture() {
  return useMemo(
    () =>
      canvasTexture(300, 400, (g, w, h) => {
        g.fillStyle = "#f6f2ea";
        g.fillRect(0, 0, w, h);
        g.fillStyle = "#b8acd9";
        g.fillRect(20, 20, w - 40, 230);
        // 4 шагай
        g.fillStyle = "#f2e3c8";
        g.strokeStyle = "#1d1b19";
        g.lineWidth = 3;
        [[85, 100], [215, 100], [85, 180], [215, 180]].forEach(([x, y]) => {
          g.beginPath(); g.ellipse(x, y, 42, 30, 0, 0, Math.PI * 2); g.fill(); g.stroke();
        });
        g.fillStyle = "#1d1b19";
        g.font = "bold 34px Georgia, serif";
        g.textAlign = "center";
        g.fillText("SparkDay", w / 2, 300);
        g.font = "20px monospace";
        g.fillText("2026 · TOP 18", w / 2, 336);
        g.fillStyle = "#f2b3a6";
        g.fillRect(20, 362, w - 40, 14);
      }),
    []
  );
}

export function RoomShell({ night }) {
  const sky = useSkyTexture(night);
  const poster = usePosterTexture();
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

      {/* Хана дээрх зурагт хуудас */}
      <group position={[-0.85, 1.62, -0.885]} rotation={[0, 0, 0.02]}>
        <mesh>
          <boxGeometry args={[0.5, 0.66, 0.02]} />
          <meshStandardMaterial color="#1d1b19" />
        </mesh>
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[0.45, 0.6]} />
          <meshStandardMaterial map={poster} roughness={0.8} />
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
