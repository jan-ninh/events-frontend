import { useContext } from "react";
import { BackendStatusContext } from "./BackendStatusContext";

export function useBackendStatus() {
  const context = useContext(BackendStatusContext);
  if (!context) throw new Error("useBackendStatus requires BackendStatusProvider");
  return context;
}
