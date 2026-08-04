import { useEffect, useState } from "react";
import * as api from "../api";
import { useAuth } from "../auth/AuthContext";
import { formatDate, formatTime } from "../components/format";
import type { SwapRequestDetail } from "../types";

export function SwapBoardPage() {
  const { token, user } = useAuth();
  const [swaps, setSwaps] = useState<SwapRequestDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!token) return;
    setLoading(true);
    try {
      setSwaps(await api.fetchOpenSwaps(token));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleClaim(swapId: number) {
    if (!token) return;
    setBusyId(swapId);
    setError(null);
    try {
      await api.claimSwap(swapId, token);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not claim swap");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-6 text-lg font-semibold text-slate-100">Swap Board</h1>
      {error && <p className="mb-4 text-sm text-rose-400">{error}</p>}
      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : swaps.length === 0 ? (
        <p className="text-slate-400">No open swap requests right now.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {swaps.map((swap) => (
            <div
              key={swap.id}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-100">
                  {formatDate(swap.work_date)} · {formatTime(swap.start_time)} – {formatTime(swap.end_time)}
                </p>
                <p className="text-sm text-slate-400">Requested by {swap.requested_by_name}</p>
              </div>
              {swap.requested_by_id !== user?.id && (
                <button
                  disabled={busyId === swap.id}
                  onClick={() => handleClaim(swap.id)}
                  className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60"
                >
                  Claim
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
