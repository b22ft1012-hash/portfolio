import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* =========================================================
   Furniture — ширээн дээрх ба эргэн тойрны эд зүйлс.
   Бүгдийг box / cylinder / sphere / torus зэрэг энгийн дүрсээр бүтээсэн.
   Хэмжээ нь метрээр: ширээний гадаргуу y = 0.75.
   ========================================================= */

const TOP = 0.75; // ширээний гадаргуугийн өндөр

// Богино бичлэг: өнгө, барзгар байдалтай материал
const Mat = ({ color, rough = 0.8, metal = 0, ...rest }) => (
  <meshStandardMaterial color={color} roughness={rough} metalness={metal} {...rest} />
);

function Box({ size, color, rough, metal, ...props }) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
      <Mat color={color} rough={rough} metal={metal} />
    </mesh>
  );
}

/* ---------- Ширээ ---------- */
export function Desk() {
  const legs = [[-0.86, -0.36], [0.86, -0.36], [-0.86, 0.36], [0.86, 0.36]];
  return (
    <group>
      <Box size={[1.8, 0.05, 0.8]} position={[0, TOP - 0.025, 0]} color="#e7e2d9" rough={0.6} />
      {legs.map(([x, z], i) => (
        <Box key={i} size={[0.05, TOP - 0.05, 0.05]} position={[x, (TOP - 0.05) / 2, z]} color="#cfc9c0" />
      ))}
      {/* Хажуугийн шургуулга */}
      <Box size={[0.4, 0.22, 0.7]} position={[-0.62, TOP - 0.16, 0]} color="#ddd7cc" />
      <Box size={[0.2, 0.015, 0.01]} position={[-0.62, TOP - 0.15, 0.355]} color="#8d877e" metal={0.4} rough={0.4} />
    </group>
  );
}

/* ---------- Сандал (дугуйтай оффисын сандал) ---------- */
export function Chair(props) {
  const legs = [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2);
  return (
    <group {...props}>
      {/* Суудал ба түшлэг */}
      <Box size={[0.48, 0.07, 0.46]} position={[0, 0.48, 0]} color="#5b4560" rough={0.95} />
      <Box size={[0.46, 0.52, 0.06]} position={[0, 0.82, 0.24]} rotation={[-0.08, 0, 0]} color="#5b4560" rough={0.95} />
      <Box size={[0.05, 0.3, 0.04]} position={[0, 0.6, 0.25]} color="#2e2e34" metal={0.5} rough={0.4} />
      {/* Гол багана */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.36, 12]} />
        <Mat color="#2e2e34" metal={0.6} rough={0.3} />
      </mesh>
      {/* 5 хөл ба дугуй */}
      {legs.map((a, i) => (
        <group key={i} rotation={[0, a, 0]}>
          <Box size={[0.04, 0.03, 0.3]} position={[0, 0.07, 0.15]} color="#2e2e34" metal={0.6} rough={0.3} />
          <mesh position={[0, 0.03, 0.29]}>
            <sphereGeometry args={[0.03, 10, 10]} />
            <Mat color="#1d1b19" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- Дэлгэцэнд гарах зураг (canvas-аар зурна) ---------- */
function useScreenTexture(night) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 400;
    const g = c.getContext("2d");
    g.fillStyle = "#0d0d0f";
    g.fillRect(0, 0, 512, 400);
    // Жижиг цэгэн хээ
    g.fillStyle = "rgba(255,255,255,0.05)";
    for (let y = 0; y < 400; y += 6) for (let x = 0; x < 512; x += 6) g.fillRect(x, y, 1.5, 1.5);
    // Лого
    g.fillStyle = "#f2b3a6";
    g.fillRect(226, 120, 60, 60);
    g.strokeStyle = "#000";
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(242, 166); g.lineTo(242, 134); g.lineTo(270, 166); g.lineTo(270, 134);
    g.stroke();
    g.fillStyle = "#e8e4dc";
    g.font = "600 30px monospace";
    g.textAlign = "center";
    g.fillText("NamjaaOS", 256, 232);
    g.fillStyle = "#a9c4b0";
    g.font = "18px monospace";
    g.fillText("▶ click / дарах", 256, 270);
    // CRT мөрүүд
    g.fillStyle = "rgba(0,0,0,0.25)";
    for (let y = 0; y < 400; y += 3) g.fillRect(0, y, 512, 1);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [night]);
}

/* ---------- Ретро компьютер: хэвтээ корпус + CRT дэлгэц ---------- */
export function Computer({ night }) {
  const tex = useScreenTexture(night);
  const glow = useRef();
  // Дэлгэцийн гэрэл бага зэрэг анивчина
  useFrame(({ clock }) => {
    if (glow.current) glow.current.intensity = (night ? 0.9 : 0.25) + Math.sin(clock.elapsedTime * 3) * 0.05;
  });
  const beige = "#e8e0cc";
  return (
    <group position={[0, TOP, -0.1]}>
      {/* Корпус */}
      <Box size={[0.56, 0.13, 0.46]} position={[0, 0.065, 0]} color={beige} rough={0.7} />
      <Box size={[0.2, 0.012, 0.005]} position={[-0.14, 0.08, 0.231]} color="#3a3a40" />
      <Box size={[0.2, 0.012, 0.005]} position={[-0.14, 0.05, 0.231]} color="#3a3a40" />
      <Box size={[0.03, 0.015, 0.005]} position={[0.2, 0.065, 0.231]} color="#a9c4b0" />
      {/* Дэлгэцийн суурь */}
      <Box size={[0.24, 0.03, 0.2]} position={[0, 0.145, -0.02]} color={beige} />
      {/* CRT — урд хүрээ ба арын товгор хэсэг */}
      <Box size={[0.52, 0.44, 0.06]} position={[0, 0.38, 0.07]} color={beige} rough={0.65} />
      <Box size={[0.42, 0.36, 0.3]} position={[0, 0.38, -0.11]} color="#ddd4bf" rough={0.7} />
      {/* Дэлгэц */}
      <mesh position={[0, 0.39, 0.1005]}>
        <planeGeometry args={[0.42, 0.33]} />
        {/* Гэрэлд нөлөөлөгдөхгүй материал — дэлгэц өөрөө гэрэлтэнэ */}
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {/* Тэмдэг ба товч */}
      <Box size={[0.06, 0.012, 0.004]} position={[-0.18, 0.18, 0.101]} color="#8d877e" />
      <mesh position={[0.2, 0.18, 0.102]}>
        <circleGeometry args={[0.008, 12]} />
        <meshBasicMaterial color="#a9c4b0" />
      </mesh>
      <pointLight ref={glow} position={[0, 0.39, 0.35]} color="#f2c6d0" distance={1.6} decay={2} />
    </group>
  );
}

/* ---------- Гар (keyboard) ---------- */
export function Keyboard() {
  const keys = useMemo(() => {
    const out = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 13; c++) {
        const special = (r === 3 && (c < 2 || c > 10)) || (r === 0 && c === 12);
        out.push({ x: -0.198 + c * 0.033, z: -0.05 + r * 0.033, color: special ? "#b8acd9" : "#f1ece4" });
      }
    }
    return out;
  }, []);
  return (
    <group position={[0, TOP, 0.22]} rotation={[0, 0, 0]}>
      <Box size={[0.47, 0.025, 0.16]} position={[0, 0.0125, 0]} color="#ddd4bf" />
      {keys.map((k, i) => (
        <Box key={i} size={[0.027, 0.012, 0.027]} position={[k.x, 0.03, k.z]} color={k.color} rough={0.6} />
      ))}
      {/* Зай авах товч */}
      <Box size={[0.18, 0.012, 0.027]} position={[0, 0.03, 0.065]} color="#f1ece4" />
    </group>
  );
}

/* ---------- Хулгана ба дэвсгэр ---------- */
export function Mouse() {
  return (
    <group position={[0.38, TOP, 0.24]}>
      <Box size={[0.22, 0.004, 0.18]} position={[0, 0.002, 0]} color="#f2b3a6" rough={1} />
      <mesh position={[0, 0.018, 0]} scale={[0.032, 0.018, 0.05]} castShadow>
        <sphereGeometry args={[1, 18, 14]} />
        <Mat color="#e8e0cc" rough={0.5} />
      </mesh>
      <mesh position={[0, 0.01, -0.12]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.07, 0.003, 6, 20, Math.PI / 2]} />
        <Mat color="#3a3a40" />
      </mesh>
    </group>
  );
}

/* ---------- Ширээний дэнлүү (гэрэлтэй) ---------- */
export function Lamp({ night }) {
  return (
    <group position={[-0.72, TOP, -0.22]}>
      <mesh position={[0, 0.012, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.024, 20]} />
        <Mat color="#3a3a40" metal={0.5} rough={0.4} />
      </mesh>
      <Box size={[0.018, 0.36, 0.018]} position={[0.03, 0.19, 0.03]} rotation={[0.15, 0, -0.18]} color="#3a3a40" metal={0.5} />
      <Box size={[0.018, 0.26, 0.018]} position={[0.14, 0.4, 0.06]} rotation={[0, 0, 1.15]} color="#3a3a40" metal={0.5} />
      {/* Бүрхүүл */}
      <mesh position={[0.26, 0.42, 0.08]} rotation={[0, 0, -0.6]} castShadow>
        <coneGeometry args={[0.08, 0.13, 20, 1, true]} />
        <meshStandardMaterial color="#f2b3a6" side={THREE.DoubleSide} roughness={0.6} />
      </mesh>
      <mesh position={[0.29, 0.38, 0.08]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial color={night ? "#fff1c9" : "#f6ecd2"} />
      </mesh>
      <pointLight position={[0.3, 0.34, 0.1]} intensity={night ? 1.4 : 0.25} color="#ffd9a0" distance={2.2} decay={2} castShadow={night} />
    </group>
  );
}

/* ---------- Ваартай ургамал ---------- */
export function Plant() {
  const leaves = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({ a: (i / 9) * Math.PI * 2, tilt: 0.35 + (i % 3) * 0.15, h: 0.16 + (i % 2) * 0.05 })),
    []
  );
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.8) * 0.02;
  });
  return (
    <group position={[0.72, TOP, -0.2]}>
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.055, 0.12, 20]} />
        <Mat color="#c97f72" />
      </mesh>
      <mesh position={[0, 0.118, 0]}>
        <cylinderGeometry args={[0.064, 0.064, 0.005, 20]} />
        <Mat color="#4a3a2e" />
      </mesh>
      <group ref={ref} position={[0, 0.12, 0]}>
        {leaves.map((l, i) => (
          <group key={i} rotation={[0, l.a, 0]}>
            <mesh position={[0, l.h / 2, 0.03]} rotation={[l.tilt, 0, 0]} scale={[0.028, l.h / 2, 0.01]} castShadow>
              <sphereGeometry args={[1, 10, 10]} />
              <Mat color={i % 2 ? "#7fa68a" : "#a9c4b0"} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ---------- Номын овоо ---------- */
export function Books() {
  const books = [
    { c: "#b8acd9", h: 0.035, r: 0.05 },
    { c: "#f2b3a6", h: 0.03, r: -0.08 },
    { c: "#f0d999", h: 0.04, r: 0.12 },
  ];
  let y = 0;
  return (
    <group position={[0.46, TOP, -0.26]} rotation={[0, -0.2, 0]}>
      {books.map((b, i) => {
        const pos = y + b.h / 2;
        y += b.h;
        return (
          <group key={i} position={[0, pos, 0]} rotation={[0, b.r, 0]}>
            <Box size={[0.24, b.h, 0.17]} color={b.c} />
            <Box size={[0.235, b.h * 0.8, 0.005]} position={[0.003, 0, 0.086]} color="#f6f2ea" />
          </group>
        );
      })}
    </group>
  );
}

/* ---------- Кофены аяга (уураар) ---------- */
export function Mug() {
  const steam = useRef();
  useFrame(({ clock }) => {
    if (!steam.current) return;
    steam.current.children.forEach((s, i) => {
      const t = (clock.elapsedTime * 0.4 + i / 3) % 1;
      s.position.y = 0.11 + t * 0.12;
      s.material.opacity = 0.35 * (1 - t);
      s.scale.setScalar(0.012 + t * 0.02);
    });
  });
  return (
    <group position={[-0.42, TOP, 0.12]}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.038, 0.034, 0.1, 20]} />
        <Mat color="#f6f2ea" rough={0.4} />
      </mesh>
      <mesh position={[0, 0.097, 0]}>
        <cylinderGeometry args={[0.033, 0.033, 0.004, 20]} />
        <Mat color="#4a2e22" rough={0.3} />
      </mesh>
      <mesh position={[0.042, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.022, 0.006, 8, 16]} />
        <Mat color="#f6f2ea" rough={0.4} />
      </mesh>
      <group ref={steam}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[(i - 1) * 0.01, 0.12, 0]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------- Монитор дээрх наалт цаас ---------- */
export function StickyNotes() {
  return (
    <group>
      <Box size={[0.06, 0.06, 0.002]} position={[0.255, 1.06, 0.003]} rotation={[0, 0, 0.08]} color="#f0d999" />
      <Box size={[0.06, 0.06, 0.002]} position={[0.26, 0.99, 0.004]} rotation={[0, 0, -0.06]} color="#f2b3a6" />
    </group>
  );
}

/* ---------- Шагай (дарахад нуугдмал тоглоом нээгдэнэ) ---------- */
export function ShagaiBones({ onClick }) {
  const [hover, setHover] = useState(false);
  const bones = [[0, 0, 0.4], [0.05, 0.02, -0.3], [0.02, 0.07, 1.2], [-0.04, 0.06, 2.1]];
  return (
    <group
      position={[0.68, TOP, 0.16]}
      onClick={onClick}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}
    >
      {bones.map(([x, z, r], i) => (
        <mesh key={i} position={[x, 0.014 + (hover ? 0.01 : 0), z]} rotation={[0, r, 0]} scale={[0.022, 0.015, 0.016]} castShadow>
          <sphereGeometry args={[1, 14, 10]} />
          <Mat color={hover ? "#fff3d6" : "#f2e3c8"} rough={0.5} />
        </mesh>
      ))}
    </group>
  );
}
