import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import MemberForm from "../components/MemberForm";
import type { MemberFormValues } from "../schemas/member.schema";
import { membersService } from "../services/members.service";
import type { Member } from "../types/member.types";

import { useAppStore } from "@/stores/app.store";

export default function EditMemberPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const branches = useAppStore((state) => state.branches);

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Member ID is missing.");
      setLoading(false);
      return;
    }

    async function loadMember() {
      try {
        setLoading(true);
        setError(null);
        if (!id) {
          return;
        }

        const data = await membersService.getMemberById(id);

        setMember(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load member.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadMember();
  }, [id]);

  async function handleSubmit(values: MemberFormValues) {
    if (!member) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await membersService.updateMember(member.id, {
        branch_id: values.branch_id,
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

      navigate(`/dashboard/members/${member.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update member.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (member) {
      navigate(`/dashboard/members/${member.id}`);
      return;
    }

    navigate("/dashboard/members");
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
        Loading member information...
      </div>
    );
  }

  if (error && !member) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/members")}
          className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Members
        </button>

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
        Member not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
          aria-label="Back to member details"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Edit Member
          </h1>

          <p className="text-sm text-muted-foreground">
            Update {member.first_name}'s information.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border bg-background p-4 sm:p-6">
        <MemberForm
          branches={branches}
          defaultBranchId={member.branch_id}
          defaultValues={{
            branch_id: member.branch_id,
            member_code: member.member_code,
            first_name: member.first_name,
            last_name: member.last_name ?? "",
            email: member.email ?? "",
            phone: member.phone ?? "",
            date_of_birth: member.date_of_birth ?? "",
            gender: member.gender ?? undefined,
            address: member.address ?? "",
            join_date: member.join_date,
            status: member.status,
          }}
          loading={saving}
          isEditMode
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}