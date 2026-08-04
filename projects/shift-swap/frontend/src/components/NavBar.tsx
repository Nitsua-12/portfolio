import { useAuth } from "../auth/AuthContext";

export type View = "shifts" | "board" | "manager";

interface Props {
  view: View;
  onNavigate: (view: View) => void;
}

export function NavBar({ view, onNavigate }: Props) {
  const { user, logout } = useAuth();
  if (!user) return null;

  const tabs: { key: View; label: string }[] = [
    { key: "shifts", label: "My Shifts" },
    { key: "board", label: "Swap Board" },
  ];
  if (user.role === "manager") tabs.push({ key: "manager", label: "Approvals" });

  return (
    <nav className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
      <div className="flex items-center gap-6">
        <span className="text-lg font-semibold text-slate-100">Shift Swap</span>
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onNavigate(tab.key)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                view === tab.key
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span>
          {user.name} · {user.role}
        </span>
        <button
          onClick={logout}
          className="rounded-md border border-slate-700 px-3 py-1 transition hover:bg-slate-800"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}
