import type { Role, Shift, SwapRequestDetail, User } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8010";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail ?? res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function login(email: string, password: string) {
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);
  return request<{ access_token: string; token_type: string }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
}

export function register(name: string, email: string, password: string, role: Role) {
  return request<User>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
}

export function fetchMe(token: string) {
  return request<User>("/auth/me", {}, token);
}

export function fetchMyShifts(token: string) {
  return request<Shift[]>("/shifts/mine", {}, token);
}

export function fetchOpenSwaps(token: string) {
  return request<SwapRequestDetail[]>("/swaps/open", {}, token);
}

export function fetchPendingSwaps(token: string) {
  return request<SwapRequestDetail[]>("/swaps/pending", {}, token);
}

export function requestSwap(shiftId: number, token: string) {
  return request<void>(`/swaps/${shiftId}`, { method: "POST" }, token);
}

export function claimSwap(swapId: number, token: string) {
  return request<void>(`/swaps/${swapId}/claim`, { method: "POST" }, token);
}

export function approveSwap(swapId: number, token: string) {
  return request<void>(`/swaps/${swapId}/approve`, { method: "POST" }, token);
}

export function denySwap(swapId: number, token: string) {
  return request<void>(`/swaps/${swapId}/deny`, { method: "POST" }, token);
}
