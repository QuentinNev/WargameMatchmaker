import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Non-null assertion: index.html guarantees #root exists.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
