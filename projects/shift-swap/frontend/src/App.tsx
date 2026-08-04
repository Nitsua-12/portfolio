import { useState } from "react";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { NavBar, type View } from "./components/NavBar";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { ManagerPage } from "./pages/ManagerPage";
import { SwapBoardPage } from "./pages/SwapBoardPage";

function AppShell() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>("shifts");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading…
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <div className="min-h-screen bg-slate-950">
      <NavBar view={view} onNavigate={setView} />
      {view === "shifts" && <DashboardPage />}
      {view === "board" && <SwapBoardPage />}
      {view === "manager" && user.role === "manager" && <ManagerPage />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
