import { BrowserRouter } from "react-router";
import { AppRouter } from "./routes/AppRouter";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { BackendStatusProvider } from "./context/BackendStatusContext";
import { useBackendStatus } from "./context/useBackendStatus";

function DemoServerNotice() {
  const { status, isReady } = useBackendStatus();
  if (isReady) return null;
  return (
    <div className="border-b border-cyan-300/25 bg-[#1a3349] px-5 py-3 text-sm text-cyan-50" role="status" aria-live="polite">
      <div className="mx-auto flex max-w-7xl items-center gap-3 sm:px-2">
        <span className="inline-block h-3 w-3 shrink-0 animate-pulse rounded-full bg-cyan-300" aria-hidden="true" />
        <span>
          {status === "checking"
            ? "Connecting to the demo server…"
            : "Starting the free demo server… This may take around a minute. Actions will be available automatically."}
        </span>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <BackendStatusProvider>
        <AuthProvider>
          <div className="site-shell min-h-screen flex flex-col">
            <Navbar />
            <DemoServerNotice />
            <main className="flex-1">
              <AppRouter />
            </main>
          </div>
        </AuthProvider>
      </BackendStatusProvider>
    </BrowserRouter>
  );
}

export default App;
