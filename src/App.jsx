import { lazy, Suspense, useEffect, useState } from "react";
import { useLang } from "./lib/lang";
import { useWindows } from "./lib/useWindows";
import { sound } from "./lib/sound";
import Boot from "./components/Boot";
import TopBar from "./components/TopBar";
import Window from "./components/Window";
import { Dock } from "./components/DesktopIcons";
import About from "./apps/About";
import { Projects, ProjectDetail } from "./apps/Projects";
import Skills from "./apps/Skills";
import Contact from "./apps/Contact";
import Readme from "./apps/Readme";
import Shagai from "./apps/Shagai";

// 3D өрөөг тусад нь ачаална (Three.js том тул эхний ачаалал хурдан байна)
const Room = lazy(() => import("./room/Room"));

export default function App() {
  const { lang, t } = useLang();
  // Үе шат: "boot" (ачаалал) → "room" (3D өрөө) → "desktop"
  const [stage, setStage] = useState("boot");
  const booted = stage === "desktop";
  const [soundOn, setSoundOn] = useState(false);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("theme") || "night"; } catch { return "night"; }
  });
  const wm = useWindows();

  // Шөнө / өдөр горим: <html data-theme="..."> → CSS хувьсагчид солигдоно
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);

  // Easter egg: гар дээр "shagai" гэж бичихэд нууц апп нээгдэнэ
  useEffect(() => {
    if (!booted) return;
    let typed = "";
    const onKey = (e) => {
      if (e.target.closest("input, textarea") || e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-6);
      if (typed === "shagai") { sound.startup(); wm.open("shagai"); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [booted]);

  function openApp(app, props) {
    sound.open();
    wm.open(app, props);
  }

  // Өрөөнөөс дэлгэц рүү орсны дараа desktop асна
  function enterDesktop(app = "about") {
    setStage("desktop");
    sound.startup();
    if (!wm.wins.length) wm.open("about");
    if (app !== "about") wm.open(app);
  }

  // Цонх бүрийн гарчиг ба агуулга
  const titleOf = (w) => (w.app === "project" ? w.props.project[lang].title : t.apps[w.app]);
  const contentOf = (w) => {
    switch (w.app) {
      case "about": return <About onOpen={openApp} />;
      case "projects": return <Projects onOpenProject={(p) => openApp("project", { id: p.id, project: p })} />;
      case "project": return <ProjectDetail project={w.props.project} />;
      case "skills": return <Skills />;
      case "contact": return <Contact />;
      case "readme": return <Readme />;
      case "shagai": return <Shagai />;
      default: return null;
    }
  };

  if (stage === "boot") return <Boot onDone={() => setStage("room")} />;
  if (stage === "room")
    return (
      <Suspense fallback={<div className="room room--loading">NamjaaOS…</div>}>
        <Room theme={theme} onEnter={enterDesktop} />
      </Suspense>
    );

  return (
    <div className="desktop">
      <TopBar
        title={wm.active ? titleOf(wm.active) : "NamjaaOS"}
        soundOn={soundOn}
        onSound={() => setSoundOn(sound.toggle())}
        theme={theme}
        onTheme={() => setTheme((x) => (x === "night" ? "day" : "night"))}
        onLogo={() => openApp("shagai")}
        onPower={() => { sound.close(); setStage("room"); }}
      />

      {wm.wins.map((w) => (
        <Window
          key={w.id}
          win={w}
          title={titleOf(w)}
          active={wm.active?.id === w.id}
          onFocus={() => wm.focus(w.id)}
          onClose={() => { sound.close(); wm.close(w.id); }}
          onMin={() => wm.toggle(w.id, "min")}
          onMax={() => wm.toggle(w.id, "max")}
          onMove={(x, y) => wm.move(w.id, x, y)}
          onResize={(width, height) => wm.resize(w.id, width, height)}
        >
          {contentOf(w)}
        </Window>
      ))}

      <Dock onOpen={openApp} openApps={wm.wins.map((w) => w.app)} />
    </div>
  );
}
