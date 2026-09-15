export type MemberSubscriptionStatus =
  | "active"
  | "expired"
  | "cancelled";

export interface MemberSubscription {
  id: string;
  tenant_id: string;
  member_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  amount: number;
  status: MemberSubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateMemberSubscriptionInput {
  tenant_id: string;
  member_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  amount: number;
  status?: MemberSubscriptionStatus;
}

export interface UpdateMemberSubscriptionInput {
  plan_id?: string;
  start_date?: string;
  end_date?: string;
  amount?: number;
  status?: MemberSubscriptionStatus;
}