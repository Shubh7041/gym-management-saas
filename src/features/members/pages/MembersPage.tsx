import { useEffect, useState } from "react";
import { membersService } from "../services/members.service";
import type { Member } from "../types/member.types";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await membersService.getMembers();

        setMembers(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load members."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Members
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage your gym members.
          </p>
        </div>

        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Add Member
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          Loading members...
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && members.length === 0 && (
        <div className="rounded-lg border p-8 text-center">
          <h2 className="font-medium">No members found</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add your first member to get started.
          </p>
        </div>
      )}

      {/* Members Table */}
      {!loading && !error && members.length > 0 && (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    Member
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Member Code
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Phone
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Join Date
                  </th>

                  <th className="px-4 py-3 text-left font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {member.first_name}{" "}
                        {member.last_name ?? ""}
                      </div>

                      {member.email && (
                        <div className="text-xs text-muted-foreground">
                          {member.email}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {member.member_code}
                    </td>

                    <td className="px-4 py-3">
                      {member.phone ?? "-"}
                    </td>

                    <td className="px-4 py-3">
                      {member.join_date}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={
                          member.status === "active"
                            ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                            : member.status === "blocked"
                              ? "rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                              : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                        }
                      >
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}