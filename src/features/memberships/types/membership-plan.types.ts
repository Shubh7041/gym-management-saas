export type MembershipPlanStatus = "active" | "inactive";

export interface MembershipPlan {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  duration_days: number;
  price: number;
  status: MembershipPlanStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateMembershipPlanInput {
  tenant_id: string;
  name: string;
  description?: string | null;
  duration_days: number;
  price: number;
  status?: MembershipPlanStatus;
}

export interface UpdateMembershipPlanInput {
  name?: string;
  description?: string | null;
  duration_days?: number;
  price?: number;
  status?: MembershipPlanStatus;
}