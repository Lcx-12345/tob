import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from 'sonner';
import App from "./App";
import "./index.css";

console.log("[App] Initializing application...");
console.warn("[App] This is a mock warning — deprecated API call detected");
console.error("[App] MockError: Failed to fetch resource at /api/data", new Error("Network request failed"));

setTimeout(() => {
  try {
    const obj: any = undefined;
    obj.access.deep.property;
  } catch (err) {
    console.error("[App] Uncaught TypeError:", err);
  }
}, 3000);

Promise.reject(new Error("Mock unhandled promise rejection — async operation failed"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>
);
