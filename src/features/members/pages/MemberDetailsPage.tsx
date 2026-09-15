import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

import { membersService } from "../services/members.service";
import type { Member } from "../types/member.types";

import { useAppStore } from "@/stores/app.store";

export default function MemberDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const branches = useAppStore((state) => state.branches);

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
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
        setError(err instanceof Error ? err.message : "Unable to load member.");
      } finally {
        setLoading(false);
      }
    }

    loadMember();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-background p-6 text-sm text-muted-foreground">
        Loading member information...
      </div>
    );
  }

  if (error) {
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

  const branch = branches.find((item) => item.id === member.branch_id);

  const fullName = [member.first_name, member.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/members")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted"
            aria-label="Back to members"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>

            <p className="text-sm text-muted-foreground">Member details</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/dashboard/members/${member.id}/edit`)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Pencil className="h-4 w-4" />
          Edit Member
        </button>
      </div>

      {/* Profile */}
      <div className="rounded-xl border bg-background p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold">Basic Information</h2>

          <p className="text-sm text-muted-foreground">
            Member profile and contact information.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Member Code" value={member.member_code} />

          <InfoItem label="Branch" value={branch?.name ?? "Unknown branch"} />

          <InfoItem label="Status" value={formatStatus(member.status)} />

          <InfoItem label="First Name" value={member.first_name} />

          <InfoItem label="Last Name" value={member.last_name ?? "—"} />

          <InfoItem label="Phone" value={member.phone ?? "—"} />

          <InfoItem label="Email" value={member.email ?? "—"} />

          <InfoItem
            label="Date of Birth"
            value={formatDate(member.date_of_birth)}
          />

          <InfoItem
            label="Gender"
            value={member.gender ? capitalize(member.gender) : "—"}
          />

          <InfoItem label="Join Date" value={formatDate(member.join_date)} />
        </div>
      </div>

      {/* Address */}
      <div className="rounded-xl border bg-background p-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold">Address</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          {member.address || "No address provided."}
        </p>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status: Member["status"]) {
  return capitalize(status);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
