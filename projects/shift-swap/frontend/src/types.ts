export type Role = "employee" | "manager";
export type SwapStatus = "open" | "claimed" | "approved" | "denied";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Shift {
  id: number;
  user_id: number;
  work_date: string;
  start_time: string;
  end_time: string;
  up_for_swap: boolean;
}

export interface SwapRequestDetail {
  id: number;
  shift_id: number;
  status: SwapStatus;
  work_date: string;
  start_time: string;
  end_time: string;
  requested_by_id: number;
  requested_by_name: string;
  claimed_by_id: number | null;
  claimed_by_name: string | null;
}
