import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MemberForm from "../components/MemberForm";
import type { MemberFormValues } from "../schemas/member.schema";
import { membersService } from "../services/members.service";

import { useAppStore } from "@/stores/app.store";

export default function AddMemberPage() {
  const navigate = useNavigate();

  const currentTenant = useAppStore((state) => state.currentTenant);
  const branches = useAppStore((state) => state.branches);
  const selectedBranchId = useAppStore((state) => state.selectedBranchId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: MemberFormValues) {
    if (!currentTenant) {
      setError("Gym information is not available.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const memberCode = await membersService.generateMemberCode(
        currentTenant.id,
      );
      await membersService.createMember({
        tenant_id: currentTenant.id,
        branch_id: values.branch_id,
        member_code: memberCode,
        first_name: values.first_name.trim(),
        last_name: values.last_name?.trim() || null,
        email: values.email?.trim() || null,
        phone: values.phone?.trim() || null,
        date_of_birth: values.date_of_birth || null,
        gender: values.gender ?? null,
        address: values.address?.trim() || null,
        join_date: values.join_date,
        status: values.status,
      });

      navigate("/dashboard/members");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create member.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate("/dashboard/members");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Member</h1>

        <p className="text-sm text-muted-foreground">
          Add a new member to your gym.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {!currentTenant ? (
        <div className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
          Gym information is still loading. Please try again in a moment.
        </div>
      ) : branches.length === 0 ? (
        <div className="rounded-lg border bg-background p-6 text-sm text-destructive">
          No active branch is available. Please create a branch before adding
          members.
        </div>
      ) : (
        <div className="rounded-xl border bg-background p-4 sm:p-6">
          <MemberForm
            branches={branches}
            defaultBranchId={selectedBranchId}
            loading={loading}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}
