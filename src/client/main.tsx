import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

ReactDOM.createRoot(document.getElementById("shell") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
