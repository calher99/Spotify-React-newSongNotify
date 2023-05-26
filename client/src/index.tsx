import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  //Remove strictMode to avoid double rendering that collides with Spotify Aithentication
  // <React.StrictMode>
  <App />
  /* </React.StrictMode> */
);
