import { createContext, useEffect, useMemo, useState } from "react";
import { apiConfig } from "../api/apiConfig";

export const BackendStatusContext = createContext(null);

export function BackendStatusProvider({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;
    let nextCheck;
    let waitingMessage;
    let timeout;

    async function check() {
      const controller = new AbortController();
      // Keep the cold-start request alive long enough for Render Free to wake up.
      timeout = setTimeout(() => controller.abort(), 85000);
      waitingMessage = setTimeout(() => {
        if (active) setStatus((current) => current === "ready" ? "ready" : "waking");
      }, 1800);
      let healthy = false;
      try {
        const response = await fetch(`${apiConfig.baseUrl}/health`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Health check failed");
        const body = await response.json();
        healthy = body.status === "ok";
      } catch {
        healthy = false;
      } finally {
        clearTimeout(timeout);
        clearTimeout(waitingMessage);
      }

      if (!active) return;
      setStatus(healthy ? "ready" : "waking");
      nextCheck = setTimeout(check, healthy ? 45000 : 5000);
    }

    check();
    return () => {
      active = false;
      clearTimeout(timeout);
      clearTimeout(waitingMessage);
      clearTimeout(nextCheck);
    };
  }, []);

  const value = useMemo(() => ({ status, isReady: status === "ready" }), [status]);
  return (
    <BackendStatusContext.Provider value={value}>
      {children}
    </BackendStatusContext.Provider>
  );
}
