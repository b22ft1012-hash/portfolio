import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useLang } from "../lib/lang";
import { sound } from "../lib/sound";
import { Desk, Chair, Computer, Keyboard, Mouse, Lamp, Plant, Books, Mug, ShagaiBones, StickyNotes } from "./Furniture";
import { RoomShell } from "./RoomShell";

/* =========================================================
   Room — сайтын эхэнд гарах 3D өрөө (Three.js + React Three Fiber)
   1. Камер өрөөг хажуугаас харна. Хулганаа хөдөлгөхөд бага зэрэг хөдөлнө.
   2. Хаана ч дарахад камер компьютерийн дэлгэц рүү ойртоно.
   3. Дэлгэцэнд хүрмэгц onEnter() дуудагдаж desktop нээгдэнэ.
   Бүх эд зүйлийг энгийн дүрсүүдээр (box, cylinder, sphere) өөрөө бүтээсэн.
   ========================================================= */

// Камерын эхлэх ба төгсөх байрлал
const START = { pos: new THREE.Vector3(1.85, 1.55, 2.05), look: new THREE.Vector3(-0.05, 0.95, 0) };
const SCREEN = { pos: new THREE.Vector3(0, 1.14, 0.42), look: new THREE.Vector3(0, 1.14, 0) };

function CameraRig({ zooming, onArrive }) {
  const { camera, pointer, size } = useThree();
  // Босоо (гар утасны) дэлгэцэнд камерыг холдуулж бүх ширээг багтаана
  const aspect = size.width / size.height;
  const start = START.look.clone().add(START.pos.clone().sub(START.look).multiplyScalar(aspect < 1 ? 1 + (1 - aspect) * 1.1 : 1));
  const look = useRef(START.look.clone());
  const arrived = useRef(false);

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.001, delta); // кадрын хурдаас үл хамаарах жигд хөдөлгөөн
    if (zooming) {
      // Дэлгэц рүү ойртох
      camera.position.lerp(SCREEN.pos, k * 0.9);
      look.current.lerp(SCREEN.look, k * 0.9);
      if (!arrived.current && camera.position.distanceTo(SCREEN.pos) < 0.03) {
        arrived.current = true;
        onArrive();
      }
    } else {
      // Хулганы байрлалаар бага зэрэг хөдөлнө (parallax)
      const target = start.clone().add(new THREE.Vector3(pointer.x * 0.35, pointer.y * 0.18, 0));
      camera.position.lerp(target, k * 0.15);
      look.current.lerp(START.look, k * 0.2);
    }
    camera.lookAt(look.current);
  });
  return null;
}

function Scene({ theme, zooming, onArrive, onShagai }) {
  const night = theme === "night";
  return (
    <>
      <color attach="background" args={[night ? "#0d0d10" : "#e9e3d8"]} />
      <fog attach="fog" args={[night ? "#0d0d10" : "#e9e3d8", 5, 11]} />

      {/* Гэрэл: шөнө — дэнлүү ба дэлгэцийн гэрэл давамгайлна; өдөр — цонхоор нар тусна */}
      <ambientLight intensity={night ? 0.55 : 0.75} color={night ? "#8f8aa8" : "#fff8ee"} />
      <directionalLight
        position={[2.5, 3.2, -2]}
        intensity={night ? 0.5 : 1.6}
        color={night ? "#9fb4ff" : "#fff1d6"}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      <hemisphereLight args={[night ? "#3a3550" : "#ffffff", night ? "#1a1418" : "#cbbfae", night ? 0.5 : 0.5]} />

      <RoomShell night={night} />
      <Desk />
      <Chair position={[0.18, 0, 0.82]} rotation={[0, -0.35, 0]} />
      <Computer night={night} />
      <Keyboard />
      <Mouse />
      <Lamp night={night} />
      <Plant />
      <Books />
      <Mug />
      <StickyNotes />
      <ShagaiBones onClick={onShagai} />

      <CameraRig zooming={zooming} onArrive={onArrive} />
    </>
  );
}

export default function Room({ theme, onEnter }) {
  const { t } = useLang();
  const [zooming, setZooming] = useState(false);
  const target = useRef("about");

  function start(app = "about") {
    if (zooming) return;
    target.current = app;
    sound.beep(660, 0.08, "sine", 0.05);
    setZooming(true);
  }

  // Анхны камерын тохиргоо
  const camera = useMemo(() => ({ position: START.pos.toArray(), fov: 42, near: 0.05, far: 30 }), []);

  return (
    <div className={`room ${zooming ? "is-zooming" : ""}`} onClick={() => start()}>
      <Canvas shadows dpr={[1, 2]} camera={camera}>
        <Scene
          theme={theme}
          zooming={zooming}
          onArrive={() => onEnter(target.current)}
          onShagai={(e) => { e.stopPropagation(); start("shagai"); }}
        />
      </Canvas>
      {!zooming && (
        <div className="room__start">
          {t.room.start} <b />
        </div>
      )}
      <div className="room__name">НАМЖИЛМАА · NamjaaOS</div>
    </div>
  );
}
