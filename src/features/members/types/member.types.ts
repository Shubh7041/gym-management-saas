export type MemberStatus = "active" | "inactive" | "blocked";

export type Gender = "male" | "female" | "other";

export interface Member {
  id: string;
  tenant_id: string;
  branch_id: string;
  member_code: string;

  first_name: string;
  last_name: string | null;

  email: string | null;
  phone: string | null;

  date_of_birth: string | null;
  gender: Gender | null;
  address: string | null;

  join_date: string;
  profile_photo_url: string | null;

  status: MemberStatus;

  created_at: string;
  updated_at: string;
}

export interface CreateMemberInput {
  tenant_id: string;
  branch_id: string;
  member_code: string;

  first_name: string;
  last_name?: string | null;

  email?: string | null;
  phone?: string | null;

  date_of_birth?: string | null;
  gender?: Gender | null;
  address?: string | null;

  join_date?: string;
  profile_photo_url?: string | null;

  status?: MemberStatus;
}

export interface UpdateMemberInput {
  branch_id?: string;

  member_code?: string;

  first_name?: string;
  last_name?: string | null;

  email?: string | null;
  phone?: string | null;

  date_of_birth?: string | null;
  gender?: Gender | null;
  address?: string | null;

  join_date?: string;
  profile_photo_url?: string | null;

  status?: MemberStatus;
}