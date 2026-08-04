import { useEffect, useState } from "react";
import * as api from "../api";
import { useAuth } from "../auth/AuthContext";
import { formatDate, formatTime } from "../components/format";
import type { Shift } from "../types";

export function DashboardPage() {
  const { token } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    setLoading(true);
    try {
      setShifts(await api.fetchMyShifts(token));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleRequestSwap(shiftId: number) {
    if (!token) return;
    setBusyId(shiftId);
    setError(null);
    try {
      await api.requestSwap(shiftId, token);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not request swap");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-6 text-lg font-semibold text-slate-100">My Shifts</h1>
      {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : shifts.length === 0 ? (
        <p className="text-slate-400">No upcoming shifts.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-100">{formatDate(shift.work_date)}</p>
                <p className="text-sm text-slate-400">
                  {formatTime(shift.start_time)} – {formatTime(shift.end_time)}
                </p>
              </div>
              <button
                disabled={shift.up_for_swap || busyId === shift.id}
                onClick={() => handleRequestSwap(shift.id)}
                className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                {shift.up_for_swap ? "Up for swap" : "Request swap"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
