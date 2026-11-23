import { BrowserRouter } from "react-router";
import { AppRouter } from "./routes/AppRouter";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="site-shell min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <AppRouter />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
