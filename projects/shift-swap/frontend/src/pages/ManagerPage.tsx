import { useEffect, useState } from "react";
import * as api from "../api";
import { useAuth } from "../auth/AuthContext";
import { formatDate, formatTime } from "../components/format";
import type { SwapRequestDetail } from "../types";

export function ManagerPage() {
  const { token } = useAuth();
  const [swaps, setSwaps] = useState<SwapRequestDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    setLoading(true);
    try {
      setSwaps(await api.fetchPendingSwaps(token));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleDecision(swapId: number, decision: "approve" | "deny") {
    if (!token) return;
    setBusyId(swapId);
    setError(null);
    try {
      if (decision === "approve") {
        await api.approveSwap(swapId, token);
      } else {
        await api.denySwap(swapId, token);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record decision");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-6 text-lg font-semibold text-slate-100">Pending Approvals</h1>
      {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : swaps.length === 0 ? (
        <p className="text-slate-400">Nothing waiting on you right now.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {swaps.map((swap) => (
            <div key={swap.id} className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
              <p className="font-medium text-slate-100">
                {formatDate(swap.work_date)} · {formatTime(swap.start_time)} – {formatTime(swap.end_time)}
              </p>
              <p className="mb-3 text-sm text-slate-400">
                {swap.requested_by_name} → {swap.claimed_by_name}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={busyId === swap.id}
                  onClick={() => handleDecision(swap.id, "approve")}
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60"
                >
                  Approve
                </button>
                <button
                  disabled={busyId === swap.id}
                  onClick={() => handleDecision(swap.id, "deny")}
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-60"
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
