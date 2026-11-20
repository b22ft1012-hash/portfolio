import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { LangProvider } from "./lib/lang";

// Фонтуудыг өөрсдөө байршуулна (кирилл Ө, Ү үсгийг бүрэн дэмждэг)
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/pt-serif/400.css";
import "@fontsource/pt-serif/700.css";
import "@fontsource/pt-serif/400-italic.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </React.StrictMode>
);
