import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@elmapt/theme/index.css";
import "./styles/app.css";

import App from "./App.tsx";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
